import { Dispatch, SetStateAction, useMemo } from "react";

import { ColorButton } from "@/components/ColorButton";
import { DisplayItem, getLiveId } from "@/components/Swatch";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorData, ColorTag, DisplayLayout } from "@/data/colors";
import { cn } from "@/lib/utils";
import { ColorFormat, formatColor } from "@/utilities/formatColor";
import { getContrastColor } from "@/utilities/getContrastColor";

export default function ColorPicker({
	colorFormat,
	colors,
	copiedColorKey,
	displayItems,
	displayLayout,
	favorites,
	filteredColors,
	handleCopy,
	selectedColor,
	setSelectedColor,
	toggleFavorite,
	toggleTag,
}: {
	colorFormat: ColorFormat;
	colors: ColorData[];
	copiedColorKey: string | null;
	displayItems: DisplayItem[];
	displayLayout: DisplayLayout;
	favorites: Set<string>;
	filteredColors: ColorData[];
	handleCopy: (color: ColorData) => Promise<void>;
	selectedColor: ColorData | null;
	setSelectedColor: Dispatch<SetStateAction<ColorData | null>>;
	toggleFavorite: (color: ColorData) => void;
	toggleTag: (tag: ColorTag) => void;
}) {
	const grid = useMemo(() => {
		const { rows, columns } = colors.reduce(
			(acc, color) => {
				const layoutData = color.layout[displayLayout];
				if (layoutData) {
					acc.rows = Math.max(acc.rows, layoutData.row);
					acc.columns = Math.max(acc.columns, layoutData.col);
				}
				return acc;
			},
			{ rows: 0, columns: 0 },
		);

		const newGrid: (ColorData | null)[][] = Array.from({ length: rows }, () =>
			Array.from({ length: columns }, () => null),
		);

		filteredColors.forEach((color) => {
			const layoutData = color.layout[displayLayout];
			if (layoutData) {
				const { row, col } = layoutData;
				if (row >= 1 && row <= rows && col >= 1 && col <= columns) {
					newGrid[row - 1][col - 1] = color;
				}
			}
		});
		return newGrid;
	}, [colors, filteredColors, displayLayout]);

	return (
		<TooltipProvider delayDuration={0}>
			<div
				className={cn(
					"flex w-full flex-col gap-1",
					displayLayout === "live" ? "max-h-lg" : "max-w-xl",
				)}
			>
				{grid.map((row, rowIndex) => (
					<div key={rowIndex} className="flex gap-1">
						{row.map((color, colIndex) => {
							if (!color) {
								return (
									<div
										className="box-border aspect-square h-full w-full border border-dashed border-border"
										key={`empty-${rowIndex}-${colIndex}`}
									/>
								);
							}

							const stableId = getLiveId(color);
							const isFavorite = favorites.has(stableId);

							return (
								<Tooltip key={stableId}>
									<TooltipTrigger asChild>
										<ColorButton
											color={color}
											copiedColorKey={copiedColorKey}
											displayItems={displayItems}
											handleCopy={handleCopy}
											isFavorite={isFavorite}
											selectedColor={selectedColor}
											setSelectedColor={setSelectedColor}
											stableId={stableId}
											toggleFavorite={toggleFavorite}
										/>
									</TooltipTrigger>
									<TooltipContent
										side="top"
										className={cn(
											"rounded-none border-none px-3 py-2 text-sm font-medium",
											"after:absolute after:top-full after:left-0 after:h-2.5 after:w-full after:content-['']",
										)}
										style={{
											backgroundColor: color.hex,
											color: getContrastColor(color.hex),
										}}
										arrowStyle={{ backgroundColor: color.hex, fill: color.hex }}
									>
										<div className="flex items-center gap-2">
											<p className="font-semibold">{color.name}</p>
										</div>
										<p className="mt-0.5 text-xs opacity-80">
											{formatColor(color, colorFormat)}
										</p>
										<div className="mt-1.5 flex flex-wrap gap-1">
											{color.tags.map((tag) => (
												<Button
													key={tag}
													color="default"
													border="none"
													className="z-10"
													onClick={(e) => {
														e.stopPropagation();
														toggleTag(tag);
													}}
													style={{
														backgroundColor: getContrastColor(color.hex),
														color: color.hex,
													}}
												>
													{tag.startsWith("cg:") ? tag.replace("cg:", "") : tag}
												</Button>
											))}
										</div>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				))}
			</div>
		</TooltipProvider>
	);
}
