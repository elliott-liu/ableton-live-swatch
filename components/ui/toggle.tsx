"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonToggleVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Toggle({
	className,
	variant,
	size,
	...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
	VariantProps<typeof buttonToggleVariants>) {
	return (
		<TogglePrimitive.Root
			data-slot="toggle"
			className={cn(buttonToggleVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Toggle };
