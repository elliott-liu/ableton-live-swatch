import { EyeOff } from "lucide-react";
import { CSSProperties, memo } from "react";

import { Button } from "@/components/ui/button";
import { ColorData } from "@/data/colors";
import { cn } from "@/lib/utils";
import { ColorFormat, formatColor } from "@/utilities/formatColor";
import { getContrastColor } from "@/utilities/getContrastColor";

export type ColorChipHideOptions = "colorCode" | "tags";

export default memo(ColorChipBase);

function ColorChipBase({
	color,
	existsInLayout,
	format,
	hide,
	toggleTag,
}: {
	color: ColorData;
	existsInLayout?: boolean | null;
	format: ColorFormat;
	hide?: ColorChipHideOptions[];
	toggleTag: (tag: string) => void;
}) {
	const displayColorCode = !hide?.includes("colorCode");
	const displayTags = !hide?.includes("tags");
	const contrastColor = getContrastColor(color.hex);
	const isHidden = existsInLayout === false;

	return (
		<div
			className={cn(
				"group relative flex w-full items-center transition-colors duration-150",
				isHidden ? "bg-muted/50 grayscale hover:grayscale-0" : "",
			)}
			style={{ backgroundColor: !isHidden ? color.hex : undefined }}
		>
			{isHidden && (
				<div
					className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
					style={{ backgroundColor: color.hex }}
				/>
			)}

			<div
				className="relative z-10 flex-1 p-3"
				style={{ color: isHidden ? undefined : contrastColor }}
			>
				<div
					className={cn(
						"transition-colors",
						isHidden && "group-hover:text-(--hover-color)!",
					)}
					style={{ "--hover-color": contrastColor } as CSSProperties}
				>
					<p className="font-semibold">{color.name}</p>
					{displayColorCode && (
						<p className="text-sm opacity-80">{formatColor(color, format)}</p>
					)}
				</div>

				{displayTags && (
					<div className="mt-1.5 flex flex-wrap gap-1">
						{color.tags.map((tag) => (
							<Button
								key={`color-chip-tag-${tag}`}
								onClick={(e) => {
									e.stopPropagation();
									toggleTag(tag);
								}}
								style={{ backgroundColor: contrastColor, color: color.hex }}
								className={cn(
									isHidden &&
										"opacity-0 transition-opacity group-hover:opacity-100",
								)}
								color="default"
								border="none"
								size="sm"
							>
								{tag.startsWith("cg:") ? tag.replace("cg:", "") : tag}
							</Button>
						))}
					</div>
				)}
			</div>

			{isHidden && (
				<div className="relative z-10 pr-4">
					<EyeOff
						className="size-4 opacity-40 transition-all group-hover:text-(--hover-color)! group-hover:opacity-100"
						style={{ "--hover-color": contrastColor } as CSSProperties}
					/>
				</div>
			)}
		</div>
	);
}

// function backup() {
// 	return (
// 		<button
// 			key={`${colorKey}-old`}
// 			onClick={() => {
// 				setSelectedColor(color);
// 				handleCopy(color);
// 			}}
// 			className={cn(
// 				"flex w-full items-center justify-between p-3 transition-opacity hover:opacity-90",
// 				selectedColor?.hex === color.hex && "ring-2 ring-foreground",
// 			)}
// 			style={{
// 				backgroundColor: color.hex,
// 				color: getContrastColor(color.hex),
// 			}}
// 			aria-label={`Select ${color.name}`}
// 		>
// 			<div className="flex flex-col items-start">
// 				<span className="font-semibold">{color.name}</span>
// 				<span className="text-xs opacity-80">
// 					{formatColor(color, colorFormat)}
// 				</span>
// 			</div>
// 			{copiedColorKey === colorKey && (
// 				<span className="animate-in text-[10px] font-medium fade-in-0 zoom-in-95">
// 					copied!
// 				</span>
// 			)}
// 		</button>
// 	);
// }
