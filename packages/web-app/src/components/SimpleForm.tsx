import { Button } from "@/components/ui/button";
import {
  Card,
  CardBottomEdge,
  CardContainer,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRightEdge,
  CardTitle,
} from "@/components/ui/card";
type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  handleBack: () => void;
  handleSubmit: () => void;
};

const SimpleForm = ({
  title,
  description,
  children,
  handleBack,
  handleSubmit,
}: Props) => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <CardContainer>
        <CardRightEdge />
        <CardBottomEdge />
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="font-manrope">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>{children}</form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </CardContainer>
    </div>
  );
};

export default SimpleForm;
