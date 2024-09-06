import type { FC, PropsWithChildren } from "hono/jsx";

export const Card: FC = ({ children }: PropsWithChildren) => {
  return (
    <div className={"flex items-center justify-center rounded-md p-3 border border-cyan-950"}>
      {children}
    </div>
  );
};
