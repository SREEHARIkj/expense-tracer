import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import React, { ComponentType, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const NoAccessPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center"> Oops </div>
  );
};

export const withAuthCheck = <P extends object>(
  WrapperComponent: ComponentType<P>
) => {
  return function WithAuthCheck({ ...props }: P): React.JSX.Element {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { isPending, isError, data } = useQuery({
      queryKey: ["authorizationCheck"],
      queryFn: getAuthState,
      retryOnMount: true,
    });

    async function getAuthState() {
      const res = await api.check.$get();

      return await res?.json();
    }

    useEffect(() => {
      if ((!isPending && data && !data.access) || isError) {
        toast({
          title: data?.error,
          variant: "destructive",
          description: data?.message,
          action: (
            <ToastAction
              altText="Login to page"
              onClick={() => {
                // navigate({ to: "/api/forms/login-form" });
                window.location.replace("/api/forms/login-form");
              }}
            >
              Login
            </ToastAction>
          ),
        });
      }
    }, [isPending, data, toast, navigate]);

    return data?.access ? <WrapperComponent {...props} /> : NoAccessPage();
  };
};
