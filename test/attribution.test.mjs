/**
 * Tests for the attribution classifier and the scoreboard reporter.
 *
 * The classifier decides which channel a lead is credited to, and that number
 * is the one the practice is judged on — so a search visit filed as "direct",
 * or an ad click filed as organic, is a wrong answer to the only question this
 * code exists to answer.
 *
 * Run with:  npm test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  attributionNote, classify, describeAttribution, encodeCookie, isBot,
  readAttribution, reportConversion, sanitize, shouldReplace, SITE_COOKIE,
} from '../src/lib/attribution.ts';

const SELF = '602medicare.com';

describe('classify — referrers', () => {
  const cases = [
    ['https://www.google.com/', 'organic-search', 'google'],
    ['https://www.bing.com/search?q=medicare', 'organic-search', 'bing'],
    ['https://duckduckgo.com/', 'organic-search', 'duckduckgo'],
    ['https://search.yahoo.com/search', 'organic-search', 'yahoo'],
    ['android-app://com.google.android.googlequicksearchbox/', 'organic-search', 'google'],
    ['https://chatgpt.com/', 'ai-search', 'chatgpt.com'],
    ['https://www.perplexity.ai/search/abc', 'ai-search', 'perplexity.ai'],
    ['https://gemini.google.com/app', 'ai-search', 'gemini.google.com'],
    ['https://l.facebook.com/l.php?u=x', 'social', 'facebook'],
    ['https://mail.google.com/mail/u/0/', 'email', 'mail.google.com'],
    ['https://nextdoor.com/news_feed/', 'social', 'nextdoor'],
    ['https://some-directory.example/agents/x', 'referral', 'some-directory.example'],
  ];
  for (const [ref, channel, source] of cases) {
    test(`${ref} → ${channel}`, () => {
      const a = classify('', ref, SELF);
      assert.equal(a.channel, channel);
      assert.equal(a.source, source);
    });
  }

  test('no referrer is direct', () => {
    assert.deepEqual(classify('', '', SELF), { channel: 'direct' });
  });
  test("the site's own pages are not a source", () => {
    assert.equal(classify('', `https://www.${SELF}/about/`, SELF).channel, 'direct');
  });
});

describe('classify — tagged links and click ids', () => {
  test('a Google Ads click is paid search whatever the referrer says', () => {
    const a = classify('?gclid=abc123', 'https://www.google.com/', SELF);
    assert.equal(a.channel, 'paid-search');
    assert.equal(a.source, 'google');
  });
  test('utm_medium=cpc on a Facebook source is paid social', () => {
    const a = classify('?utm_source=facebook&utm_medium=cpc&utm_campaign=aep', '', SELF);
    assert.equal(a.channel, 'paid-social');
    assert.equal(a.campaign, 'aep');
  });
  test('a Business Profile link counts as organic search', () => {
    assert.equal(classify('?utm_source=gbp&utm_medium=organic', 'https://www.google.com/', SELF).channel, 'organic-search');
  });
  test("ChatGPT's own utm_source is an AI referral", () => {
    assert.equal(classify('?utm_source=chatgpt.com', '', SELF).channel, 'ai-search');
  });
  test('a bare fbclid is social, not paid', () => {
    assert.equal(classify('?fbclid=xyz', '', SELF).channel, 'social');
  });
  test('an unrecognised tag is still kept as a campaign', () => {
    assert.equal(classify('?utm_source=flyer&utm_medium=print', '', SELF).channel, 'campaign');
  });
});

describe('first touch', () => {
  test('keeps the first channel', () => {
    assert.equal(shouldReplace({ channel: 'organic-search' }, { channel: 'social' }), false);
  });
  test("lets a real source replace 'direct'", () => {
    assert.equal(shouldReplace({ channel: 'direct' }, { channel: 'organic-search' }), true);
  });
  test('records when nothing is on file', () => {
    assert.equal(shouldReplace(null, { channel: 'direct' }), true);
  });
});

describe('the cookie', () => {
  test('round-trips', () => {
    const a = { channel: 'organic-search', source: 'google', landing: '/blog/a-post/', first_seen: '2026-09-29' };
    assert.deepEqual(readAttribution(`other=1; ${SITE_COOKIE}=${encodeCookie(a)}; x=y`), a);
  });
  test('rejects a channel it does not know', () => {
    assert.equal(sanitize({ channel: 'made-up' }), null);
  });
  test('drops a landing value that is not a path', () => {
    assert.deepEqual(sanitize({ channel: 'direct', landing: 'https://evil.example/' }), { channel: 'direct' });
  });
  test('survives garbage', () => {
    assert.equal(readAttribution(`${SITE_COOKIE}=%7Bnot-json`), null);
    assert.equal(readAttribution(null), null);
  });
});

describe('notes', () => {
  test('describes a source', () => {
    assert.equal(describeAttribution({ channel: 'organic-search', source: 'google' }), 'Organic search (google)');
    assert.equal(describeAttribution({ channel: 'direct' }), 'Direct');
  });
  test('builds the CRM lines', () => {
    assert.deepEqual(
      attributionNote({ channel: 'ai-search', source: 'chatgpt.com', landing: '/blog/x/', first_seen: '2026-09-29' }),
      ['Found us via: AI assistant (chatgpt.com)', 'First page: /blog/x/', 'First visit: 2026-09-29'],
    );
    assert.deepEqual(attributionNote(null), []);
  });
});

describe('reportConversion', () => {
  const event = { site: SELF, type: 'lead', attr: null, contact: { phone: '4805550147' } };

  test('is off when the secrets are not set', async () => {
    let called = 0;
    assert.equal(await reportConversion({}, event, async () => { called++; return new Response('{}'); }), false);
    assert.equal(called, 0);
  });
  test('posts with the key and fills in an unknown channel', async () => {
    const calls = [];
    const f = async (url, init) => { calls.push([url, init]); return new Response('{}', { status: 200 }); };
    assert.equal(await reportConversion({ TRACK_URL: 'https://t.example/e', TRACK_KEY: 'k' }, event, f), true);
    assert.equal(calls[0][0], 'https://t.example/e');
    assert.equal(calls[0][1].headers['x-track-key'], 'k');
    assert.deepEqual(JSON.parse(calls[0][1].body).attr, { channel: 'unknown' });
  });
  test('never throws', async () => {
    const f = async () => { throw new Error('down'); };
    assert.equal(await reportConversion({ TRACK_URL: 'https://t.example/e', TRACK_KEY: 'k' }, event, f), false);
  });
});

describe('isBot', () => {
  test('flags crawlers and empty agents', () => {
    assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)'), true);
    assert.equal(isBot(''), true);
  });
  test('passes a phone', () => {
    assert.equal(isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1'), false);
  });
});
