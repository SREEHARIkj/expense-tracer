import SimpleForm from "@/components/SimpleForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/createCategory")({
  component: withAuthCheck(CreateCategory),
});

function CreateCategory() {
  const navigate = useNavigate();

  // const [incomeCategory, expenseCategory] = useQueries({
  //   queries: [
  //     {
  //       queryKey: ["incomeCategory"],
  //       queryFn: async () => {},
  //     },
  //     {
  //       queryKey: ["expenseCategory"],
  //       queryFn: async () => {},
  //     },
  //   ],
  // });

  const handleBack = () => {
    navigate({ to: "/categories", viewTransition: true });
  };
  return (
    <>
      <SimpleForm
        title="Create Category"
        description="Category details"
        handleBack={handleBack}
        handleSubmit={() => {}}
      >
        <div className="grid w-full items-center gap-4">
          <Label htmlFor="type">Type</Label>
          <div className="flex flex-row flex-grow gap-2">
            <Button
              onClick={(e) => e.preventDefault()}
              variant={"outline"}
              className="w-1/2"
            >
              Income
            </Button>
            <Button
              onClick={(e) => e.preventDefault()}
              variant={"outline"}
              className="w-1/2 "
            >
              Expense
            </Button>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="source">Source</Label>
            <div>Input icon</div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category_name">Category name</Label>
            <Input
              id="category_name"
              name="category_name"
              placeholder="Category name"
              // value={incomeDetails.amount}
              // onChange={handleExpenseData}
            />
          </div>
        </div>
      </SimpleForm>
    </>
  );
}
