import { Check, Copy, Heart } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, memo } from "react";

import { ColorCoordinateId, DisplayItem } from "@/components/Swatch";
import { ColorData } from "@/data/colors";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/utilities/getContrastColor";

const ColorButtonBase = forwardRef<
	HTMLButtonElement,
	{
		color: ColorData;
		copiedColorKey: string | null;
		displayItems: DisplayItem[];
		handleCopy: (color: ColorData) => Promise<void>;
		isFavorite: boolean;
		selectedColor: ColorData | null;
		setSelectedColor: Dispatch<SetStateAction<ColorData | null>>;
		stableId: ColorCoordinateId;
		toggleFavorite: (color: ColorData) => void;
	}
>(
	(
		{
			color,
			copiedColorKey,
			displayItems,
			handleCopy,
			isFavorite,
			selectedColor,
			setSelectedColor,
			stableId,
			toggleFavorite,
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				{...props}
				onClick={(e) => {
					e.stopPropagation();
					setSelectedColor(color);
				}}
				onDoubleClick={(e) => {
					e.preventDefault();
					toggleFavorite(color);
				}}
				className={cn(
					"group relative box-border flex aspect-square h-full w-full items-center justify-center border border-border transition-transform hover:z-10 hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none",
					selectedColor?.hex === color.hex && "ring-2 ring-foreground",
				)}
				style={{
					backgroundColor: color.hex,
				}}
				aria-label={`Select ${color.name}`}
			>
				<Heart
					className={cn(
						"size-3 md:hidden",
						"transition-all duration-150 ease-in-out",
						isFavorite && "fill-current opacity-50 group-hover:opacity-50",
						!isFavorite && "fill-transparent opacity-0",
					)}
					style={{ color: getContrastColor(color.hex) }}
				/>
				<div
					className="hidden md:block"
					onClick={(e) => {
						e.stopPropagation();
						setSelectedColor(color);
						toggleFavorite(color);
					}}
				>
					<Heart
						className={cn(
							"absolute top-1 left-1 size-3",
							"transition-all duration-150 ease-in-out",
							isFavorite &&
								"fill-current opacity-50 group-hover:opacity-50 hover:fill-transparent hover:opacity-70",
							!isFavorite &&
								"fill-transparent opacity-0 group-hover:opacity-50 hover:fill-current hover:opacity-70",
						)}
						style={{ color: getContrastColor(color.hex) }}
					/>
				</div>
				<div className="group hidden md:block">
					{copiedColorKey === stableId ? (
						<Check
							className={cn("absolute right-1 bottom-1 size-3", "opacity-70")}
							style={{ color: getContrastColor(color.hex) }}
						/>
					) : (
						<div
							onClick={(e) => {
								e.stopPropagation();
								setSelectedColor(color);
								handleCopy(color);
							}}
						>
							<Copy
								className={cn(
									"absolute right-1 bottom-1 size-3",
									"opacity-0 group-hover:opacity-50 hover:opacity-70",
								)}
								style={{ color: getContrastColor(color.hex) }}
							/>
						</div>
					)}
				</div>
				{displayItems.includes("names") && (
					<div className={cn("flex-col text-xs lowercase", "hidden lg:flex")}>
						{color.name.split(" ").map((l, i) => (
							<span
								key={`${color.name}-line-${i}-${l}`}
								style={{
									color: getContrastColor(color.hex),
								}}
							>
								{l}
							</span>
						))}
					</div>
				)}
			</button>
		);
	},
);

ColorButtonBase.displayName = "ColorButton";

export const ColorButton = memo(ColorButtonBase);
