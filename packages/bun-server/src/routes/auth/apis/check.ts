import { Hono } from "hono";
import { type Context } from "../../../utils/context";

type ApiResponse<T> = {
  status: string;
  message: string;
  error?: string;
  access: T;
};

export const check = new Hono<Context>().get("/", async (c) => {
  const session = c.get("session");
  if (!session) {
    const response: ApiResponse<false> = {
      status: "error",
      message: "You must be logged in to access this page",
      error: "Unauthorized user",
      access: false,
    };
    return c.json(response, 401);
  }

  const response: ApiResponse<true> = {
    status: "success",
    message: "Access granted",
    access: true,
  };
  return c.json(response);
});
