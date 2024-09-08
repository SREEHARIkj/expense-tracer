import { Hono } from "hono";
import { test } from "../routes/test";
import { logger } from "hono/logger";
import type { Context } from "../utils/context";
import { forms } from "../routes/auth/forms";
import { auth } from "../routes/auth/apis/auth";
import { csrf } from "hono/csrf";
import {
  requestOriginMiddleware,
  validateSessionMiddleware,
} from "./middleware";
import { check } from "../routes/auth/apis/check";
import { cors } from "hono/cors";
import { creditRoute } from "../routes/expenses/credit";
import { transactions } from "../routes/expenses";
import { debitRoute } from "../routes/expenses/debit";
import { serveStatic } from "hono/bun";

const app = new Hono<Context>();

app.use("*", logger());
app.use(
  csrf({
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);
app.use(
  "*",
  cors({
    origin: "*",
  })
);

app.use("*", requestOriginMiddleware);

app.use("*", validateSessionMiddleware);

// serve FE form bun on production
app.get(
  "*",
  serveStatic({
    root: "../ui-dist",
  })
);
app.get(
  "*",
  serveStatic({
    path: "../ui-dist/index.html",
  })
);

const apiRouts = app
  .basePath("/api")
  .route("/test", test)
  .route("/forms", forms)
  .route("/auth", auth)
  .route("/check", check)
  .route("/credit", creditRoute)
  .route("/debit", debitRoute)
  .route("/transactions", transactions);

export default app;

export type AppType = typeof apiRouts;
