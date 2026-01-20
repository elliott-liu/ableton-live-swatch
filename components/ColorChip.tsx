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
}): React.ComponentProps<"button"> {
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
								variant={"solid"}
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
