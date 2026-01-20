import { Check, Copy, Heart } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";

import { DisplayItem } from "@/components/Swatch";
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
					<div key={`swatch-grid-row-${rowIndex}`} className="flex gap-1">
						{row.map((color, colIndex) => {
							if (!color) {
								return (
									<div
										className="box-border aspect-square h-full w-full border border-dashed border-border"
										key={`swatch-grid-empty-${rowIndex}-${colIndex}`}
									/>
								);
							}

							const currentLayoutData = color.layout[displayLayout];
							const colorKey = currentLayoutData
								? `swatch-grid-${currentLayoutData.col}-${currentLayoutData.row}`
								: `swatch-grid-no-layout-${color.hex}`;
							const isFavorited = favorites.has(colorKey);

							return (
								<Tooltip key={`swatch-tooltip-${colorKey}`}>
									<TooltipTrigger asChild>
										<button
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
												selectedColor?.hex === color.hex &&
													"ring-2 ring-foreground",
											)}
											style={{
												backgroundColor: color.hex,
											}}
											aria-label={`Select ${color.name}`}
										>
											<div
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
														isFavorited &&
															"fill-current opacity-50 group-hover:opacity-50 hover:fill-transparent hover:opacity-70",
														!isFavorited &&
															"fill-transparent opacity-0 group-hover:opacity-50 hover:fill-current hover:opacity-70",
													)}
													style={{ color: getContrastColor(color.hex) }}
												/>
											</div>
											<div className="group">
												{copiedColorKey === colorKey ? (
													<Check
														className={cn(
															"absolute right-1 bottom-1 size-3",
															"opacity-70",
														)}
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
											{displayItems.includes("color-names") && (
												<div
													className={cn(
														"flex-col text-xs lowercase",
														"hidden lg:flex",
													)}
												>
													{color.name.split(" ").map((l, i) => (
														<span
															key={`swatch-color-name-${color.name}-line-${i}-${l}`}
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
									</TooltipTrigger>
									<TooltipContent
										side="top"
										className="rounded-none border-none px-3 py-2 text-sm font-medium"
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
													key={`swatch-tooltip-tag-${tag}`}
													variant={"solid"}
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
