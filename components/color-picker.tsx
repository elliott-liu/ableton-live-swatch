"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColorData, colorGroupHexMap, colors, DisplayLayout } from "@/data/colors";
import { cn } from "@/lib/utils";
import { ColorFormat, formatColor } from "@/utilities/formatColor";
import { getContrastColor } from "@/utilities/getContrastColor";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const otherTags = Array.from(new Set(colors.flatMap((c) => c.tags.filter((t) => !t.startsWith("cg:"))))).sort();

export function ColorPicker() {
	const [layout, setLayout] = useState<DisplayLayout>("live");
	const [format, setFormat] = useState<ColorFormat>("hex");
	const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
	const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [showFavorites, setShowFavorites] = useState(false);

	const TOTAL_COLS = layout === "live" ? 14 : 8;
	const TOTAL_ROWS = layout === "live" ? 5 : 8;
	const COLOR_SIZE = 50;
	const GAP_SIZE = 4;
	const TOTAL_WIDTH = TOTAL_COLS * COLOR_SIZE + (TOTAL_COLS - 1) * GAP_SIZE;

	const filteredColors = useMemo(() => {
		const hasTagFilters = selectedTags.length > 0;

		if (!showFavorites && !hasTagFilters) return colors;

		return colors.filter((color) => {
			const key = `${color.layout.live.col}-${color.layout.live.row}`;
			const matchesFavorites = !showFavorites || favorites.has(key);
			const matchesTags = selectedTags.every((tag) => color.tags.includes(tag));
			return matchesFavorites && matchesTags;
		});
	}, [selectedTags, showFavorites, favorites]);

	const filteredColorKeys = useMemo(() => {
		return new Set(filteredColors.map((c) => `${c.layout.live.col}-${c.layout.live.row}`));
	}, [filteredColors]);

	useEffect(() => {
		if (selectedColor) {
			const selectedColorKey = `${selectedColor.layout.live.col}-${selectedColor.layout.live.row}`;
			if (!filteredColorKeys.has(selectedColorKey)) {
				setSelectedColor(null);
			}
		}

		if (filteredColors.length === 1) {
			const onlyColor = filteredColors[0];
			if (selectedColor?.hex !== onlyColor.hex) {
				setSelectedColor(onlyColor);
			}
		}
	}, [selectedColor, filteredColorKeys, filteredColors]);

	const tagCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const tag of otherTags) {
			const tagsToCheck = selectedTags.includes(tag) ? selectedTags : [...selectedTags, tag];
			const matchingColors = colors.filter((color) => {
				const key = `${color.layout.live.col}-${color.layout.live.row}`;
				const matchesFavorites = !showFavorites || favorites.has(key);
				return matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t));
			});
			counts[tag] = matchingColors.length;
		}
		return counts;
	}, [selectedTags, showFavorites, favorites]);

	const colorGroupCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		Object.entries(colorGroupHexMap).forEach(([tag]) => {
			const tagsToCheck = selectedTags.includes(tag) ? selectedTags : [...selectedTags.filter((t) => !t.startsWith("cg:")), tag];
			const matchingColors = colors.filter((color) => {
				const key = `${color.layout.live.col}-${color.layout.live.row}`;
				const matchesFavorites = !showFavorites || favorites.has(key);
				return matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t));
			});
			counts[tag] = matchingColors.length;
		});

		return counts;
	}, [selectedTags, showFavorites, favorites]);

	const favoritesCount = useMemo(() => {
		if (showFavorites) {
			return favorites.size;
		}
		return colors.filter((color) => {
			const key = `${color.layout.live.col}-${color.layout.live.row}`;
			return favorites.has(key) && selectedTags.every((tag) => color.tags.includes(tag));
		}).length;
	}, [favorites, selectedTags, showFavorites]);

	const favoriteColors = useMemo(() => {
		return colors.filter((color) => favorites.has(`${color.layout.live.col}-${color.layout.live.row}`));
	}, [favorites]);

	useEffect(() => {
		if (favoritesCount === 0 && showFavorites === true) {
			setShowFavorites(false);
		}
	}, [favoritesCount, showFavorites]);

	const grid = Array.from({ length: TOTAL_ROWS }, (_, rowIndex) =>
		Array.from({ length: TOTAL_COLS }, (_, colIndex) => {
			const color = colors.find((c) => c.layout.live.row === rowIndex + 1 && c.layout.live.col === colIndex + 1);
			if (!color) return null;
			const isActive = filteredColorKeys === null || filteredColorKeys.has(`${color.layout.live.col}-${color.layout.live.row}`);
			return { color, isActive };
		})
	);

	const handleCopy = async (color: ColorData) => {
		const value = formatColor(color, format);
		await navigator.clipboard.writeText(value);
		const key = `${color.layout.live.col}-${color.layout.live.row}`;
		setCopiedColorKey(key);
		setTimeout(() => setCopiedColorKey(null), 1500);
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => {
			if (prev.includes(tag)) {
				return prev.filter((t) => t !== tag);
			}
			if (tag.startsWith("cg:")) {
				return [...prev.filter((t) => !t.startsWith("cg:")), tag];
			}
			return [...prev, tag];
		});
	};

	const toggleFavorite = (color: ColorData) => {
		const key = `${color.layout.live.col}-${color.layout.live.row}`;
		setFavorites((prev) => {
			const next = new Set(prev);
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	};

	const handleExport = () => {
		const filteredColors =
			filteredColorKeys === null ? colors : colors.filter((c) => filteredColorKeys.has(`${c.layout.live.col}-${c.layout.live.row}`));

		const exportData = {
			format,
			selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
			showFavoritesOnly: showFavorites || undefined,
			colors: filteredColors.map((c) => ({
				name: c.name,
				value: formatColor(c, format),
				tags: c.tags,
				isFavorite: favorites.has(`${c.layout.live.col}-${c.layout.live.row}`) || undefined,
			})),
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `ableton-colors-${format}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col gap-4" style={{ width: `${TOTAL_WIDTH}px` }}>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-foreground">Ableton Live Swatch</h2>
				<div className="flex items-center gap-2">
					{favorites.size > 0 && (
						<button
							onClick={() => {
								setFavorites(new Set());
								setShowFavorites(false);
							}}
							className="px-2 py-0.5 text-xs border border-border text-foreground hover:bg-muted transition-colors"
						>
							clear favorites
						</button>
					)}
					<button
						onClick={handleExport}
						className="px-2 py-0.5 text-xs border border-border text-foreground hover:bg-muted transition-colors"
					>
						export
					</button>
					<ToggleGroup
						type="single"
						value={layout}
						onValueChange={(value) => value && setLayout(value as DisplayLayout)}
						className="border border-border"
					>
						<ToggleGroupItem
							value="live"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							live
						</ToggleGroupItem>
						<ToggleGroupItem
							value="push"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							push
						</ToggleGroupItem>
					</ToggleGroup>
					<ToggleGroup
						type="single"
						value={format}
						onValueChange={(value) => value && setFormat(value as ColorFormat)}
						className="border border-border"
					>
						<ToggleGroupItem
							value="hex"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							hex
						</ToggleGroupItem>
						<ToggleGroupItem
							value="rgb"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							rgb
						</ToggleGroupItem>
						<ToggleGroupItem
							value="hsl"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							hsl
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>

			<div className="flex flex-col gap-1">
				<div className="flex flex-wrap gap-1">
					<button
						onClick={() => setShowFavorites(!showFavorites)}
						disabled={favoritesCount === 0 && !showFavorites}
						className={cn(
							"px-2 py-0.5 text-xs border transition-colors flex items-center gap-1",
							favoritesCount === 0 && !showFavorites
								? "bg-muted text-muted-foreground/50 border-border/50 cursor-not-allowed"
								: showFavorites
								? "bg-foreground text-background border-foreground"
								: "bg-background text-foreground border-border hover:bg-muted"
						)}
					>
						<Heart className="w-3 h-3" fill={favoritesCount === 0 ? "none" : "currentColor"} />
						{favoritesCount > 0 && (
							<span className={cn(showFavorites ? "text-background/60" : "text-muted-foreground")}>· {favoritesCount}</span>
						)}
					</button>
					{otherTags.map((tag) => {
						const count = tagCounts[tag];
						const isDisabled = count === 0;
						return (
							<button
								key={tag}
								onClick={() => !isDisabled && toggleTag(tag)}
								disabled={isDisabled}
								className={cn(
									"px-2 py-0.5 text-xs border transition-colors lowercase",
									isDisabled
										? "bg-muted text-muted-foreground/50 border-border/50 cursor-not-allowed"
										: selectedTags.includes(tag)
										? "bg-foreground text-background border-foreground"
										: "bg-background text-foreground border-border hover:bg-muted"
								)}
							>
								{tag}
								{count > 0 && (
									<span className={cn("ml-0.5", selectedTags.includes(tag) ? "text-background/60" : "text-muted-foreground")}>
										· {count}
									</span>
								)}
							</button>
						);
					})}
					{(selectedTags.length > 0 || showFavorites) && (
						<button
							onClick={() => {
								setSelectedTags([]);
								setShowFavorites(false);
							}}
							className="px-2 py-0.5 text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
						>
							clear all
						</button>
					)}
				</div>

				<TooltipProvider delayDuration={0}>
					<div className="flex flex-col gap-1">
						<div className="flex gap-1">
							{Object.entries(colorGroupHexMap).map(([tag, value], colIndex) => {
								const tagColor = value || "#888888";
								const textColor = getContrastColor(tagColor);
								const isSelected = selectedTags.includes(tag);
								const count = colorGroupCounts[tag];
								const isDisabled = count === 0;
								return (
									<button
										key={colIndex}
										onClick={() => !isDisabled && toggleTag(tag)}
										disabled={isDisabled}
										className={cn(
											"flex items-center justify-center text-xs font-medium transition-colors",
											isDisabled
												? "opacity-30 cursor-not-allowed"
												: isSelected
												? "ring-2 ring-foreground ring-offset-1"
												: "opacity-80 hover:opacity-100"
										)}
										style={{
											width: `${COLOR_SIZE}px`,
											height: `${COLOR_SIZE * 0.5}px`,
											backgroundColor: tagColor,
											color: textColor,
										}}
									>
										{tag.replace("cg:", "")}
									</button>
								);
							})}
						</div>
						{grid.map((row, rowIndex) => (
							<div key={rowIndex} className="flex gap-1">
								{row.map((cell, colIndex) => {
									if (!cell) {
										return <div key={colIndex} style={{ width: `${COLOR_SIZE}px`, height: `${COLOR_SIZE}px` }} />;
									}
									const { color, isActive } = cell;
									const colorKey = `${color.layout.live.col}-${color.layout.live.row}`;
									const isFavorited = favorites.has(colorKey);
									if (!isActive) {
										return (
											<div
												key={colorKey}
												className="border border-dashed border-border opacity-30"
												style={{ width: `${COLOR_SIZE}px`, height: `${COLOR_SIZE}px` }}
											/>
										);
									}
									return (
										<Tooltip key={colorKey}>
											<TooltipTrigger asChild>
												<button
													key={colorKey}
													onClick={() => {
														setSelectedColor(color);
														handleCopy(color);
													}}
													onDoubleClick={(e) => {
														e.preventDefault();
														toggleFavorite(color);
													}}
													className={cn(
														"group relative transition-all hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center",
														selectedColor?.hex === color.hex && "ring-2 ring-foreground"
													)}
													style={{
														width: `${COLOR_SIZE}px`,
														height: `${COLOR_SIZE}px`,
														backgroundColor: color.hex,
													}}
													aria-label={`Select ${color.name}`}
												>
													<div
														onClick={(e) => {
															e.stopPropagation();
															toggleFavorite(color);
														}}
													>
														<Heart
															className={cn(
																"w-3 h-3 absolute top-1 left-1",
																"transition-opacity duration-150 ease-in-out",
																isFavorited && "opacity-25 fill-current hover:fill-none",
																!isFavorited && "opacity-0 fill-none hover:fill-current group-hover:opacity-25 group-hover:fill-none"
															)}
															style={{ color: getContrastColor(color.hex) }}
														/>
													</div>
													{copiedColorKey === colorKey && (
														<span
															className="text-[10px] font-medium animate-in fade-in-0 zoom-in-95"
															style={{ color: getContrastColor(color.hex) }}
														>
															copied!
														</span>
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												className="px-3 py-2 text-sm font-medium rounded-none border-none"
												style={{ backgroundColor: color.hex, color: getContrastColor(color.hex) }}
												arrowClassName="rounded-none z-0 relative"
												arrowStyle={{ backgroundColor: color.hex, fill: color.hex }}
											>
												<div className="flex items-center gap-2">
													<p className="font-semibold">{color.name}</p>
												</div>
												<p className="text-xs mt-0.5 opacity-80">{formatColor(color, format)}</p>
												<div className="flex flex-wrap gap-1 mt-1.5">
													{color.tags.map((tag) => (
														<button
															key={tag}
															onClick={(e) => {
																e.stopPropagation();
																toggleTag(tag);
															}}
															className="px-1.5 py-0.5 text-xs lowercase transition-opacity hover:opacity-60 z-10"
															style={{
																backgroundColor: getContrastColor(color.hex),
																color: color.hex,
															}}
														>
															{tag.startsWith("cg:") ? tag.replace("cg:", "") : tag}
														</button>
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
			</div>

			{selectedColor && (
				<div className="flex items-center" style={{ backgroundColor: selectedColor.hex }}>
					<div className="flex-1 p-3" style={{ color: getContrastColor(selectedColor.hex) }}>
						<p className="font-semibold">{selectedColor.name}</p>
						<p className="text-sm opacity-80">{formatColor(selectedColor, format)}</p>
						<div className="flex flex-wrap gap-1 mt-1.5">
							{selectedColor.tags.map((tag) => (
								<button
									key={tag}
									onClick={() => toggleTag(tag)}
									className="px-1.5 py-0.5 text-xs lowercase transition-opacity hover:opacity-60"
									style={{
										backgroundColor: getContrastColor(selectedColor.hex),
										color: selectedColor.hex,
									}}
								>
									{tag.startsWith("cg:") ? tag.replace("cg:", "") : tag}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{favoriteColors.length > 0 && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<Heart className="w-3 h-3" fill="currentColor" />
						<span>favorites</span>
					</div>
					<div className="flex flex-col gap-1">
						{favoriteColors.map((color) => {
							const colorKey = `${color.layout.live.col}-${color.layout.live.row}`;
							return (
								<button
									key={colorKey}
									onClick={() => {
										setSelectedColor(color);
										handleCopy(color);
									}}
									className={cn(
										"flex items-center justify-between p-3 w-full transition-opacity hover:opacity-90",
										selectedColor?.hex === color.hex && "ring-2 ring-foreground"
									)}
									style={{ backgroundColor: color.hex, color: getContrastColor(color.hex) }}
									aria-label={`Select ${color.name}`}
								>
									<div className="flex flex-col items-start">
										<span className="font-semibold">{color.name}</span>
										<span className="text-xs opacity-80">{formatColor(color, format)}</span>
									</div>
									{copiedColorKey === colorKey && <span className="text-[10px] font-medium animate-in fade-in-0 zoom-in-95">copied!</span>}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
