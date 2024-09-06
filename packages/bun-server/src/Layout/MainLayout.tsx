import type { PropsWithChildren } from "hono/jsx";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Expense Tracker</title>
      </head>
      <body>
        <content>{children}</content>
      </body>
    </html>
  );
}
