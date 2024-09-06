import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonCastShadow =
  "shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-5px active:translate-x-5px transition transform";
const buttonInShadow =
  "active:shadow-[-5px_-5px_0px_0px_rgba(0,0,0,0.3)] shadow-none active:translate-y-5px active:translate-x-5px transition transform";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground hover:bg-primary/90 ${buttonCastShadow}`,
        destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90 ${buttonCastShadow}`,
        outline: `border border-input bg-background hover:bg-accent hover:text-accent-foreground ${buttonInShadow}`,
        secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${buttonCastShadow}`,
        ghost: `hover:bg-accent hover:text-accent-foreground`,
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-7 py-6",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
