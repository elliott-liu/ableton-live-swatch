import { Button } from "@/components/ui/button";
import { ColorData } from "@/data/colors";
import { ColorFormat, formatColor } from "@/utilities/formatColor";
import { getContrastColor } from "@/utilities/getContrastColor";

export type ColorChipHideOptions = "colorCode" | "tags";
export default function ColorChip({
	format,
	color: selectedColor,
	toggleTag,
	hide,
}: {
	format: ColorFormat;
	color: ColorData;
	toggleTag: (tag: string) => void;
	hide?: ColorChipHideOptions[];
}) {
	const displayColorCode = !hide?.includes("colorCode");
	const displayTags = !hide?.includes("tags");

	return (
		<div
			className="flex w-full items-center"
			style={{ backgroundColor: selectedColor.hex }}
		>
			<div
				className="flex-1 p-3"
				style={{ color: getContrastColor(selectedColor.hex) }}
			>
				<p className="font-semibold">{selectedColor.name}</p>
				{displayColorCode && (
					<p className="text-sm opacity-80">
						{formatColor(selectedColor, format)}
					</p>
				)}
				{displayTags && (
					<div className="mt-1.5 flex flex-wrap gap-1">
						{selectedColor.tags.map((tag) => (
							<Button
								key={tag}
								onClick={() => toggleTag(tag)}
								style={{
									backgroundColor: getContrastColor(selectedColor.hex),
									color: selectedColor.hex,
								}}
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
