"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { buttonToggleVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof buttonToggleVariants> & {
		spacing?: number;
	}
>({
	color: "default",
	border: "outline",
	size: "sm",
});

function ToggleGroup({
	className,
	color = "default",
	border = "outline",
	size = "sm",
	spacing = 0,
	children,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
	VariantProps<typeof buttonToggleVariants> & {
		spacing?: number;
	}) {
	return (
		<ToggleGroupPrimitive.Root
			data-slot="toggle-group"
			data-color={color}
			data-border={border}
			data-size={size}
			data-spacing={spacing}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))]",
				className,
			)}
			{...props}
		>
			<ToggleGroupContext.Provider value={{ color, border, size, spacing }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive.Root>
	);
}

function ToggleGroupItem({
	className,
	children,
	color,
	border,
	size,
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
	VariantProps<typeof buttonToggleVariants>) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			data-slot="toggle-group-item"
			data-color={context.color || color}
			data-border={context.border || border}
			data-size={context.size || size}
			data-spacing={context.spacing}
			className={cn(
				buttonToggleVariants({
					color: context.color || color,
					border: context.border || border,
					size: context.size || size,
				}),
				"w-auto min-w-0 shrink-0 focus:z-10 focus-visible:z-10",
				"data-[spacing=0]:data-[border=outline]:border-l-0 data-[spacing=0]:data-[border=outline]:first:border-l",
				className,
			)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}

export { ToggleGroup, ToggleGroupItem };
