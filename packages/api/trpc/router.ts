import type {} from "@prisma/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import * as adminProcedures from "../modules/admin/procedures";
import * as aiProcedures from "../modules/ai/procedures";
import * as authProcedures from "../modules/auth/procedures";
import * as billingProcedures from "../modules/billing/procedures";
import * as newsletterProcedures from "../modules/newsletter/procedures";
import * as uploadsProcedures from "../modules/uploads/procedures";
import * as ctaProcedures from "../modules/cta/index";
import { router } from "./base";

export const apiRouter = router({
  auth: router(authProcedures),
  billing: router(billingProcedures),
  newsletter: router(newsletterProcedures),
  ai: router(aiProcedures),
  uploads: router(uploadsProcedures),
  admin: router(adminProcedures),
  cta: router(ctaProcedures)
});

export type ApiRouter = typeof apiRouter;
export type ApiInput = inferRouterInputs<ApiRouter>;
export type ApiOutput = inferRouterOutputs<ApiRouter>;
