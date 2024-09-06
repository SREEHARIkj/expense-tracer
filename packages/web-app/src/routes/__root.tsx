import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { UserSettings } from "../components/UserSettings";

const RootComponent = () => (
  <>
    <div className="flex items-center justify-between">
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/income" className="[&.active]:font-bold">
          Income
        </Link>
        <Link to="/expense" className="[&.active]:font-bold">
          Expense
        </Link>
        <Link to="/categories" className="[&.active]:font-bold">
          Categories
        </Link>
      </div>
      <UserSettings />
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({
  component: RootComponent,
});
