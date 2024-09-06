import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export const Route = createFileRoute("/income/")({
  component: withAuthCheck(IncomePage),
});

function IncomePage(): JSX.Element {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["incomeList"],
    queryFn: getCreditedDetails,
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: deleteIncomeData,
    onSuccess() {
      toast({
        title: "Success",
        description: "Deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["incomeList"] });
      setSelectedIds([]);
    },
  });

  async function getCreditedDetails() {
    const res = await api.credit.$get();

    const data = await res.json();
    if (!res.ok && !Array.isArray(data)) {
      throw new Error(data.error);
    }
    return data;
  }

  function getSubTotal(): number | undefined {
    if (Array.isArray(data)) {
      return data.reduce((acc, curr) => acc + (Number(curr.amount) ?? 0), 0);
    }
    return undefined;
  }

  async function deleteIncomeData() {
    const res = await api.credit.$delete({
      json: {
        ids: selectedIds,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error);
    }

    return data;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <Skeleton className="w-full h-[500px] m-4 rounded-0" />;
  }

  const handleCheckBox = (id: number) => {
    setSelectedIds((prev) => {
      if (prev?.includes?.(id)) {
        return prev?.filter((item) => item !== id);
      }
      return !prev.length ? [id] : [...prev, id];
    });
  };

  return (
    <div className="m-4">
      <div className="w-full py-5">
        <Button
          onClick={() =>
            navigate({ to: "/income/CreateIncome", viewTransition: true })
          }
        >
          Create Income
        </Button>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className={cn(
            `w-full transition-all duration-500 ease-in-out `,
            selectedIds.length ? "w-5/6" : ""
          )}
        >
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead className="w-[100px]">Income Id</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) &&
                data?.map?.((creditedData) => (
                  <TableRow key={creditedData.income_id}>
                    <TableCell>
                      <Checkbox
                        onClick={() => handleCheckBox(creditedData.income_id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {creditedData.income_id}
                    </TableCell>
                    <TableCell>{creditedData.source}</TableCell>
                    <TableCell>
                      {creditedData?.date
                        ? new Date(creditedData?.date).toUTCString()
                        : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {creditedData.amount}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$ {getSubTotal()}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <Button
          className={`absolute top-0 right-5 w-24 transition-all duration-500 ease-in-out ${
            selectedIds.length ? "opacity-100" : "opacity-0 -right-24"
          }`}
          onClick={() => {
            deleteIncomeMutation.mutate();
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
