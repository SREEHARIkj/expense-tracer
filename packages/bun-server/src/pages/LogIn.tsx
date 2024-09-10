/** @jsx jsx */
/** @jsxImportSource hono/jsx */

import { MainLayout } from "../Layout/MainLayout";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import type { z } from "zod";

export default function LogIn({
  errorMessages,
}: {
  errorMessages: Array<z.ZodError> | undefined;
}) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
        <Card>
          <form method="post" action="/api/auth/login">
            <div class={"flex flex-col justify-center items-center gap-1"}>
              <Input placeHolder={"Enter email"} name={"email"} />
              <Input placeHolder={"Enter password"} name={"password"} />
              <Button disabled={false}>Log in</Button>

              {errorMessages?.map?.((error) => <div>{error.message}</div>)}
            </div>
            <div class={'mt-2 text-sm'} >
              Create Account ?<a href="/api/forms/signup-form"> SignUp</a>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
