"use client";

import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ColorChip from "@/components/ColorChip";
import ColorPicker from "@/components/ColorPicker";
import Tags from "@/components/Tags";
import Tools from "@/components/Tools";
import { ColorData, ColorTag, DisplayLayout, colors } from "@/data/colors";
import { cn } from "@/lib/utils";
import { ColorFormat, formatColor } from "@/utilities/formatColor";
import { getContrastColor } from "@/utilities/getContrastColor";
import { toggleArrayItem } from "@/utilities/toggleArrayItem";

export type DisplayItem = "color-names";

export function Swatch() {
	const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null);
	const [displayLayout, setDisplayLayout] = useState<DisplayLayout>("live");
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");
	const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
	const [selectedTags, setSelectedTags] = useState<ColorTag[]>([]);
	const [showFavorites, setShowFavorites] = useState(false);
	const [displayItems, setDisplayItems] = useState<DisplayItem[]>([
		"color-names",
	]);

	const filteredColors = useMemo(() => {
		const hasTagFilters = selectedTags.length > 0;

		if (!showFavorites && !hasTagFilters) return colors;

		return colors.filter((color) => {
			const layoutData = color.layout[displayLayout];

			if (!layoutData) return false;

			const key = `${layoutData.col}-${layoutData.row}`;

			const matchesFavorites = !showFavorites || favorites.has(key);
			const matchesTags = selectedTags.every((tag) => color.tags.includes(tag));

			return matchesFavorites && matchesTags;
		});
	}, [selectedTags, showFavorites, favorites, displayLayout]);

	const filteredColorKeys = useMemo(() => {
		if (!showFavorites && selectedTags.length === 0) return null;

		return new Set(
			filteredColors
				.map((c) => c.layout[displayLayout])
				.filter(Boolean)
				.map((layoutData) => `${layoutData!.col}-${layoutData!.row}`),
		);
	}, [filteredColors, displayLayout, showFavorites, selectedTags]);

	useEffect(() => {
		if (selectedColor) {
			const selectedLayoutData = selectedColor.layout[displayLayout];
			if (selectedLayoutData) {
				const selectedColorKey = `${selectedLayoutData.col}-${selectedLayoutData.row}`;
				if (filteredColorKeys && !filteredColorKeys.has(selectedColorKey)) {
					setSelectedColor(null);
				}
			} else {
				setSelectedColor(null);
			}
		}

		if (filteredColors.length === 1) {
			const onlyColor = filteredColors[0];
			if (selectedColor?.hex !== onlyColor.hex) {
				setSelectedColor(onlyColor);
			}
		}
	}, [selectedColor, filteredColorKeys, filteredColors, displayLayout]);

	const favoritesCount = useMemo(() => {
		if (showFavorites) {
			return colors.filter((color) => {
				const layoutData = color.layout[displayLayout];
				if (!layoutData) return false;
				const key = `${layoutData.col}-${layoutData.row}`;
				return (
					favorites.has(key) &&
					selectedTags.every((tag) => color.tags.includes(tag))
				);
			}).length;
		}

		return colors.filter((color) => {
			const layoutData = color.layout[displayLayout];
			if (!layoutData) return false;
			const key = `${layoutData.col}-${layoutData.row}`;
			return (
				favorites.has(key) &&
				selectedTags.every((tag) => color.tags.includes(tag))
			);
		}).length;
	}, [favorites, selectedTags, showFavorites, displayLayout]);

	const favoriteColors = useMemo(() => {
		return colors.filter((color) => {
			const layoutData = color.layout[displayLayout];
			if (!layoutData) return false;
			const key = `${layoutData.col}-${layoutData.row}`;
			return favorites.has(key);
		});
	}, [favorites, displayLayout]);

	useEffect(() => {
		if (favoritesCount === 0 && showFavorites === true) {
			setShowFavorites(false);
		}
	}, [favoritesCount, showFavorites]);

	const handleCopy = async (color: ColorData) => {
		const value = formatColor(color, colorFormat);
		await navigator.clipboard.writeText(value);

		const layoutData = color.layout[displayLayout];
		if (layoutData) {
			const key = `${layoutData.col}-${layoutData.row}`;
			setCopiedColorKey(key);
			setTimeout(() => setCopiedColorKey(null), 1500);
		} else {
			console.warn(
				"Attempted to copy a color without layout data for the current display layout.",
			);
			setCopiedColorKey(null);
		}
	};

	const toggleTag = (tag: ColorTag) => toggleArrayItem(tag, setSelectedTags);
	const toggleFavorite = (color: ColorData) => {
		const layoutData = color.layout[displayLayout];

		if (!layoutData) {
			console.warn(
				"Attempted to favorite a color without layout data for the current display layout.",
			);
			return;
		}

		const key = `${layoutData.col}-${layoutData.row}`;

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

	const tags = Array.from(new Set(colors.flatMap((c) => c.tags))).sort();
	const tagCounts = useMemo(() => {
		const counts: Record<ColorTag, number> = {};
		for (const tag of tags) {
			const tagsToCheck = selectedTags.includes(tag)
				? selectedTags
				: [...selectedTags, tag];
			const matchingColors = colors.filter((color) => {
				const layoutData = color.layout[displayLayout];
				if (!layoutData) return false;

				const key = `${layoutData.col}-${layoutData.row}`;
				const matchesFavorites = !showFavorites || favorites.has(key);
				return (
					matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t))
				);
			});
			counts[tag] = matchingColors.length;
		}

		return counts;
	}, [selectedTags, showFavorites, favorites, displayLayout]);

	const handleExport = () => {
		const colorsToExport = filteredColors;

		const exportData = {
			format: colorFormat,
			selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
			showFavoritesOnly: showFavorites || undefined,
			colors: colorsToExport.map((c) => {
				const layoutData = c.layout[displayLayout];

				const favoriteKey = layoutData
					? `${layoutData.col}-${layoutData.row}`
					: null;

				return {
					name: c.name,
					value: formatColor(c, colorFormat),
					tags: c.tags,
					isFavorite: (favoriteKey && favorites.has(favoriteKey)) || undefined,
				};
			}),
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `ableton-colors-${colorFormat}-${displayLayout}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex w-full flex-col items-center gap-1">
				<Tools
					colorFormat={colorFormat}
					displayItems={displayItems}
					displayLayout={displayLayout}
					favorites={favorites}
					handleExport={handleExport}
					setColorFormat={setColorFormat}
					setDisplayItems={setDisplayItems}
					setDisplayLayout={setDisplayLayout}
					setFavorites={setFavorites}
					setShowFavorites={setShowFavorites}
				/>
				<Tags
					displayLayout={displayLayout}
					favoritesCount={favoritesCount}
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					setShowFavorites={setShowFavorites}
					showFavorites={showFavorites}
					tagCounts={tagCounts}
					tags={tags}
					toggleTag={toggleTag}
				/>
				<ColorPicker
					colorFormat={colorFormat}
					colors={filteredColors}
					copiedColorKey={copiedColorKey}
					displayItems={displayItems}
					displayLayout={displayLayout}
					favorites={favorites}
					handleCopy={handleCopy}
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
					toggleFavorite={toggleFavorite}
					toggleTag={toggleTag}
				/>
			</div>
			{selectedColor && (
				<ColorChip
					format={colorFormat}
					color={selectedColor}
					toggleTag={toggleTag}
					hide={[]}
				/>
			)}
			{favoriteColors.length > 0 && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<Heart className="h-3 w-3" fill="currentColor" />
						<span>favorites</span>
					</div>
					<div className="flex flex-col gap-1">
						{favoriteColors.map((color) => {
							const layoutData = color.layout[displayLayout];
							const colorKey = `${layoutData!.col}-${layoutData!.row}`;

							return (
								<>
									<ColorChip
										key={colorKey}
										format={colorFormat}
										color={color}
										toggleTag={toggleTag}
										hide={["tags"]}
									/>
									<button
										key={colorKey}
										onClick={() => {
											setSelectedColor(color);
											handleCopy(color);
										}}
										className={cn(
											"flex w-full items-center justify-between p-3 transition-opacity hover:opacity-90",
											selectedColor?.hex === color.hex &&
												"ring-2 ring-foreground",
										)}
										style={{
											backgroundColor: color.hex,
											color: getContrastColor(color.hex),
										}}
										aria-label={`Select ${color.name}`}
									>
										<div className="flex flex-col items-start">
											<span className="font-semibold">{color.name}</span>
											<span className="text-xs opacity-80">
												{formatColor(color, colorFormat)}
											</span>
										</div>
										{copiedColorKey === colorKey && (
											<span className="animate-in text-[10px] font-medium fade-in-0 zoom-in-95">
												copied!
											</span>
										)}
									</button>
								</>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
