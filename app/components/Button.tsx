// Tremor Button [v0.2.0]

import { Slot } from "@radix-ui/react-slot";
import { RiLoader2Fill } from "@remixicon/react";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cx, focusRing } from "../lib/utils";

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color - black on yellow
        "text-black",
        // background color - yellow accent
        "bg-[#E8C547]",
        // hover color
        "hover:bg-[#d4b33d]",
        // disabled
        "disabled:bg-[#E8C547]/50 disabled:text-black/70",
      ],
      secondary: [
        // border
        "border-gray-300 dark:border-gray-700",
        // text color
        "text-black dark:text-white",
        // background color
        "bg-white dark:bg-black",
        //hover color
        "hover:bg-gray-100 dark:hover:bg-gray-900",
        // disabled
        "disabled:text-gray-400",
        "disabled:dark:text-gray-600",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-black dark:text-white",
        // background color
        "bg-gray-100 dark:bg-gray-900",
        // hover color
        "hover:bg-gray-200 dark:hover:bg-gray-800",
        // disabled
        "disabled:text-gray-400 disabled:bg-gray-100",
        "disabled:dark:bg-gray-900 disabled:dark:text-gray-600",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-black dark:text-white",
        // hover color
        "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900",
        // disabled
        "disabled:text-gray-400",
        "disabled:dark:text-gray-600",
      ],
      destructive: [
        // text color
        "text-white",
        // border
        "border-transparent",
        // background color
        "bg-red-600 dark:bg-red-700",
        // hover color
        "hover:bg-red-700 dark:hover:bg-red-600",
        // disabled
        "disabled:bg-red-300 disabled:text-white",
        "disabled:dark:bg-red-950 disabled:dark:text-red-400",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
