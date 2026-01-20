import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const baseStateClasses = [
	"data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:hover:bg-accent-foreground data-[state=on]:hover:text-accent",
	"data-[state=off]:bg-background data-[state=off]:text-foreground data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground",
	"disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-muted disabled:text-muted-foreground/50",
];

const buttonToggleVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-opacity outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			color: {
				default: [
					"bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
					...baseStateClasses,
				],
				destructive: [
					"bg-destructive text-background hover:bg-destructive-foreground",
					...baseStateClasses,
				],
			},
			border: {
				none: "",
				outline: "border border-border",
			},
			size: {
				sm: "h-6 gap-1 px-1.5 py-0.5 text-xs lowercase",
				"icon-sm": "size-6 p-1.5 text-xs",
			},
		},
		defaultVariants: {
			color: "default",
			border: "outline",
			size: "sm",
		},
	},
);

export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonToggleVariants> & {
		asChild?: boolean;
	};
function Button({
	className,
	color = "default",
	border = "outline",
	size = "sm",
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			data-color={color}
			data-border={border}
			data-size={size}
			className={cn(buttonToggleVariants({ color, border, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonToggleVariants };
