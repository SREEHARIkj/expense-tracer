import type { PropsWithChildren } from "hono/jsx";

type Props = {
  disabled: boolean;
};

export const Button = ({
  children,
  disabled = false,
}: PropsWithChildren<Props>) => {
  return (
    <button
      type="submit"
      className={"bg-blue-500 text-white rounded-md p-2 w-[150px] h-9"}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
