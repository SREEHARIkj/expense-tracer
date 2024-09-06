import { Hono } from "hono";
import type { Context } from "../../utils/context";

import LogIn from "../../pages/LogIn";
import SignUp from "../../pages/SignUp";
import type { z } from "zod";

const formatQuery = (queryString: string | undefined) =>{
  return queryString
    ? (JSON.parse(queryString) as z.ZodError[] | undefined)
    : undefined;
};

export const forms = new Hono<Context>()
  .get("/login-form", async (c) => {
    const messageQuery = c.req.query("message");
    const message = formatQuery(messageQuery);

    return c.html(<LogIn errorMessages={message} />);
  })
  .get("signup-form", async (c) => {
    const messageQuery = c.req.query("message");
    const message = formatQuery(messageQuery);

    return c.html(<SignUp errorMessages={message} />);
  })
  .get("user-logout", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.redirect("/api/forms/login-form");
    }

    return c.html(
      <div>
        <div>{`user id : ${user.id}`}</div>
        <div>{`user name : ${user.username}`}</div>
        <form method="get" action={"/api/auth/logout"}>
          <button>logout</button>
        </form>
      </div>
    );
  });
