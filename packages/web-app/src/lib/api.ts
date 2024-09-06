import { hc } from "hono/client";
import { type AppType } from "@server/src/server/app";

const client = hc<AppType>("/");

export const api = client.api;
