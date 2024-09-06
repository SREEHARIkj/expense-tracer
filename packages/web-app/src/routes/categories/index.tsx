import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBottomEdge,
  CardContainer,
  CardContent,
  CardHeader,
  CardRightEdge,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { withAuthCheck } from "@/lib/auth-utility/withAuthCheck";
import { getRandomColor } from "@/lib/utils/randomColor";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
  component: withAuthCheck(categoriesList),
});

function categoriesList() {
  const navigate = useNavigate();
  const handleCreateCategory = () => {
    navigate({ to: "/categories/createCategory", viewTransition: true });
  };
  return (
    <div className="flex flex-col gap-4 w-fit p-4">
      <div className="flex flex-row gap-4 pb-7">
        <Input className="w-[200px]" />
        <Button>Search</Button>
        <Button variant={"secondary"} onClick={handleCreateCategory}>
          {" "}
          + Add
        </Button>
      </div>
      <div className="flex flex-row gap-5 flex-wrap ">
        {new Array(6).fill(null).map((_, index) => (
          <>
            <CardContainer className="w-[200px]" key={`${index}`}>
              <Card style={{ background: getRandomColor() }}>
                <CardHeader>
                  <CardTitle>
                    <div className=" flex flex-row justify-between">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>$ 0000 </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-manrope font-semibold">test</div>
                  <div>No of Categories</div>
                </CardContent>
              </Card>
              <CardRightEdge />
              <CardBottomEdge />
            </CardContainer>
          </>
        ))}
      </div>
    </div>
  );
}
