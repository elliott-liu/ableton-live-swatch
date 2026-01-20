import { VariantProps } from "class-variance-authority";
import { MouseEvent, ReactNode, useState } from "react";

import { Button, buttonToggleVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonToggleVariants>;

type CleanVariant<T extends keyof ButtonVariants> = Exclude<
	ButtonVariants[T],
	null
>;

interface ConfirmButtonProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"color"
> {
	onConfirm: () => void;
	initialText: ReactNode;
	confirmText: ReactNode;
	initialIcon?: ReactNode;
	confirmIcon?: ReactNode;
	color?: CleanVariant<"color">;
	confirmColor?: CleanVariant<"color">;
	border?: CleanVariant<"border">;
	size?: CleanVariant<"size">;
}

export function ConfirmButton({
	onConfirm,
	initialText,
	confirmText,
	initialIcon,
	confirmIcon,
	confirmColor = "destructive",
	color = "default",
	border = "outline",
	className,
	...props
}: ConfirmButtonProps) {
	const [isConfirming, setIsConfirming] = useState(false);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (isConfirming) {
			onConfirm();
			setIsConfirming(false);
		} else {
			setIsConfirming(true);
		}
	};

	return (
		<Button
			{...props}
			color={isConfirming ? confirmColor : color}
			border={border}
			onMouseLeave={() => setIsConfirming(false)}
			onClick={handleClick}
			className={className}
		>
			{isConfirming ? confirmIcon : initialIcon}
			<div className="relative">
				<span
					className={cn(
						!isConfirming ? "invisible" : "visible",
						"absolute top-0 right-0 h-full w-full",
					)}
				>
					{confirmText}
				</span>
				<span className={cn(isConfirming ? "invisible" : "visible")}>
					{initialText}
				</span>
			</div>
		</Button>
	);
}
