import { api } from "../lib/api";

export const logOutUser = async () => {
  const res = await api.auth.logout.$get();

  return (await res?.json()) as { redirectUrl: string };
};
