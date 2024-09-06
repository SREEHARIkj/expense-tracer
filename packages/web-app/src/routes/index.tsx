import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import {
  Card,
  CardBottomEdge,
  CardContainer,
  CardContent,
  CardHeader,
  CardRightEdge,
  CardTitle,
} from "@/components/ui/card";
import TimeLine from "@/components/TimeLine";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseType, IncomeType } from "@/lib/types";
import CurveChart from "@/components/CurveChart";

export const Route = createFileRoute("/")({
  component: withAuthCheck(Index),
});

type OverviewType = {
  income: number;
  expenses: number;
  balance: number;
  savingRate: string;
};

type TimeLineType = { [key: string]: Array<IncomeType | ExpenseType> };

function Index() {
  const { toast } = useToast();
  const [transactionsData, overviewData] = useQueries({
    queries: [
      {
        queryKey: ["transactions"],
        queryFn: getTransactions,
      },
      {
        queryKey: ["overview"],
        queryFn: getOverview,
      },
    ],
  });

  async function getOverview(): Promise<OverviewType> {
    const res = await api.transactions.overview.$get();

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return await res.json();
  }

  async function getTransactions(): Promise<TimeLineType> {
    const res = await api.transactions.$get({
      query: {
        limit: "10",
        offset: "0",
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return (await res.json())?.data as TimeLineType;
  }

  useEffect(() => {
    if (transactionsData.isError) {
      toast({
        title: "Error",
        description: transactionsData.error.message,
        variant: "destructive",
      });
    }
  }, [transactionsData.isError]);

  if (transactionsData.isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  const formatDate = (dateString: string) => {
    let dateParts = dateString.split("/");
    return new Date(+dateParts[2], +dateParts[0], +dateParts[1]);
  };

  const graphData = () => {
    if (transactionsData?.data) {
      return Object.entries(transactionsData?.data)
        ?.map(([_, value]) =>
          value.map((v) => ({
            date: formatDate(v.date),
            value: +v.amount,
          }))
        )
        ?.flat();
    }
  };

  return (
    <div className=" grid grid-cols-12 gap-2 px-5">
      <div className=" h-full w-full col-start-1 col-span-8 bg-slate-300 flex align-top justify-center">
        <CurveChart width={400} height={200} data={graphData()} />
      </div>
      <div className="w-full h-fit col-start-9 col-span-4 flex-col gap-7 justify-start items-center">
        <div className="font-bold text-3xl">Overview</div>
        <div className="p-4 flex flex-row gap-5">
          {overviewData.data ? (
            Object.entries(overviewData.data)?.map(([key, value], index) => (
              <CardContainer className="w-[200px]" key={`${index}-${key}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{key}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-manrope font-semibold">
                      {key !== "savingRate" ? "$" : ""}
                      {value}
                      {key === "savingRate" ? "%" : ""}
                    </div>
                  </CardContent>
                </Card>
                <CardRightEdge />
                <CardBottomEdge />
              </CardContainer>
            ))
          ) : (
            <div>Over view data is not available at the moment</div>
          )}
        </div>
        <div className="font-bold text-3xl">Recent Transactions</div>
        <div className="m-2 w-[500px]">
          <TimeLine listData={transactionsData.data} />
        </div>
      </div>
    </div>
  );
}
