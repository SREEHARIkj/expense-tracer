import type { FC } from "hono/jsx";

export const Input: FC = (props) => {
    return (
        <input
            type="text"
            className={"border border-gray-300 rounded-md p-2 w-[150px] h-9"}
            {...props} />
    );
};
