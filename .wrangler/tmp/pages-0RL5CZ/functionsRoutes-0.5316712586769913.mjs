import { onRequest as __api_availability_ts_onRequest } from "/Users/brianpenner/Documents/GitHub/insuranceanthem-site/functions/api/availability.ts"
import { onRequest as __api_lead_ts_onRequest } from "/Users/brianpenner/Documents/GitHub/insuranceanthem-site/functions/api/lead.ts"
import { onRequest as ___middleware_ts_onRequest } from "/Users/brianpenner/Documents/GitHub/insuranceanthem-site/functions/_middleware.ts"

export const routes = [
    {
      routePath: "/api/availability",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_availability_ts_onRequest],
    },
  {
      routePath: "/api/lead",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_lead_ts_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]