"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import ColorChip, { ColorChipHideOptions } from "@/components/ColorChip";
import ColorPicker from "@/components/ColorPicker";
import Tags from "@/components/Tags";
import Tools from "@/components/Tools";
import { ColorData, ColorTag, DisplayLayout, colors } from "@/data/colors";
import { useUrlState } from "@/hooks/useUrlState";
import { ColorFormat, formatColor } from "@/utilities/formatColor";

export type DisplayItem = "names";
export type ColorCoordinateId = `${number}-${number}`;

export type State = {
	layout: DisplayLayout;
	format: ColorFormat;
	tags: ColorTag[];
	display: DisplayItem[];
	favorites: ColorCoordinateId[];
};

export const DEFAULT_STATE: State = {
	layout: "live",
	format: "hex",
	tags: [],
	display: ["names"],
	favorites: [],
};

export const getLiveId = (color: ColorData): ColorCoordinateId => {
	return `${color.layout.live.col}-${color.layout.live.row}`;
};

export function Swatch() {
	const [state, updateState] = useUrlState(DEFAULT_STATE);

	const allTags = useMemo(
		() => Array.from(new Set(colors.flatMap((c) => c.tags))).sort(),
		[],
	);

	const setFormat = useCallback(
		(format: ColorFormat) => updateState({ format }),
		[updateState],
	);
	const setLayout = useCallback(
		(layout: DisplayLayout) => updateState({ layout }),
		[updateState],
	);
	const setSelectedTags = useCallback(
		(tags: ColorTag[]) => updateState({ tags }),
		[updateState],
	);
	const setDisplayItems = useCallback(
		(display: DisplayItem[]) => updateState({ display }),
		[updateState],
	);
	const setFavorites = useCallback(
		(favorites: ColorCoordinateId[]) => updateState({ favorites }),
		[updateState],
	);

	const [copiedColorKey, setCopiedColorKey] =
		useState<ColorCoordinateId | null>(null);
	const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);

	const favoritesSet = useMemo(
		() => new Set(state.favorites),
		[state.favorites],
	);

	const filteredColors = useMemo(() => {
		const onlyShowFavorites = state.tags.includes("favorite");
		const metadataTags = state.tags.filter((t) => t !== "favorite");

		if (state.tags.length === 0) return colors;

		return colors.filter((color) => {
			const layoutData = color.layout[state.layout];
			if (!layoutData) return false;

			const stableId = getLiveId(color);
			const matchesFavorites = !onlyShowFavorites || favoritesSet.has(stableId);
			const matchesTags = metadataTags.every((tag) => color.tags.includes(tag));

			return matchesFavorites && matchesTags;
		});
	}, [state.tags, state.layout, favoritesSet]);

	const filteredColorKeys = useMemo(() => {
		if (!state.tags.includes("favorite") && state.tags.length === 0)
			return null;
		return new Set(filteredColors.map((c) => getLiveId(c)));
	}, [filteredColors, state.tags]);

	const favoritesCount = useMemo(() => {
		const metadataTags = state.tags.filter((t) => t !== "favorite");
		return colors.filter((color) => {
			const isFavorite = favoritesSet.has(getLiveId(color));
			const existsInCurrentLayout = !!color.layout[state.layout];
			const matchesTags = metadataTags.every((tag) => color.tags.includes(tag));
			return existsInCurrentLayout && isFavorite && matchesTags;
		}).length;
	}, [favoritesSet, state.tags, state.layout]);

	const favoriteColors = useMemo(() => {
		return colors.filter((color) => favoritesSet.has(getLiveId(color)));
	}, [favoritesSet]);

	const tagCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		const isFilteringFavorite = state.tags.includes("favorite");

		for (const tag of allTags) {
			const metadataTagsToCheck = state.tags.includes(tag)
				? state.tags.filter((t) => t !== "favorite")
				: [...state.tags.filter((t) => t !== "favorite"), tag];

			counts[tag] = colors.filter((color) => {
				if (!color.layout[state.layout]) return false;
				const stableId = getLiveId(color);
				const matchesFavorite =
					!isFilteringFavorite || favoritesSet.has(stableId);
				const matchesMetadata = metadataTagsToCheck.every((t) =>
					color.tags.includes(t),
				);
				return matchesFavorite && matchesMetadata;
			}).length;
		}
		return counts;
	}, [allTags, state.tags, favoritesSet, state.layout]);

	const toggleTag = useCallback(
		(itemOrItems: ColorTag | ColorTag[]) => {
			let newTags = [...state.tags];
			const itemsToToggle = Array.isArray(itemOrItems)
				? itemOrItems
				: [itemOrItems];

			itemsToToggle.forEach((item) => {
				if (newTags.includes(item)) {
					newTags = newTags.filter((i) => i !== item);
				} else {
					if (typeof item === "string" && item.startsWith("cg:")) {
						newTags = newTags.filter((t) => !t.startsWith("cg:"));
					}
					newTags.push(item);
				}
			});
			updateState({ tags: newTags });
		},
		[state.tags, updateState],
	);

	const handleCopy = useCallback(
		async (color: ColorData) => {
			const value = formatColor(color, state.format);
			await navigator.clipboard.writeText(value);

			const layoutData = color.layout[state.layout];
			if (layoutData) {
				const key: ColorCoordinateId = `${layoutData.col}-${layoutData.row}`;
				setCopiedColorKey(key);
				setTimeout(() => setCopiedColorKey(null), 1500);
			}
		},
		[state.format, state.layout],
	);

	const handleExport = useCallback(() => {
		const colorsToExport = filteredColors;

		const exportData = {
			format: state.format,
			selectedTags: state.tags.length > 0 ? state.tags : undefined,
			showFavoritesOnly: state.tags.includes("favorite") || undefined,
			colors: colorsToExport.map((c) => {
				const stableId = getLiveId(c);

				return {
					name: c.name,
					value: formatColor(c, state.format),
					tags: c.tags,
					isFavorite: favoritesSet.has(stableId) || undefined,
				};
			}),
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `ableton-colors-${state.format}-${state.layout}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}, [filteredColors, state.format, state.layout, state.tags, favoritesSet]);

	const toggleFavorite = useCallback(
		(color: ColorData) => {
			const key = getLiveId(color);
			const nextFavorites = state.favorites.includes(key)
				? state.favorites.filter((id) => id !== key)
				: [...state.favorites, key];
			updateState({ favorites: nextFavorites });
		},
		[state.favorites, updateState],
	);

	const handleSelect = useCallback((color: ColorData) => {
		setSelectedColor((prev) => (prev?.hex === color.hex ? prev : color));
	}, []);

	useEffect(() => {
		if (filteredColors.length === 1) {
			const onlyColor = filteredColors[0];
			if (selectedColor?.hex !== onlyColor.hex) {
				setSelectedColor(onlyColor);
			}
			return;
		}

		if (selectedColor) {
			const stableId = getLiveId(selectedColor);
			const existsInLayout = !!selectedColor.layout[state.layout];
			const isFilteredOut =
				filteredColorKeys !== null && !filteredColorKeys.has(stableId);

			if (!existsInLayout || isFilteredOut) {
				setSelectedColor(null);
			}
		}
	}, [filteredColorKeys, filteredColors, state.layout, selectedColor?.hex]);

	useEffect(() => {
		if (favoritesCount === 0 && state.tags.includes("favorite")) {
			toggleTag("favorite");
		}
	}, [favoritesCount, state.tags, toggleTag]);

	return (
		<div className="flex flex-col gap-1 md:gap-2 lg:gap-4">
			<div className="flex w-full flex-col items-center gap-1">
				<Tools
					colorFormat={state.format}
					displayItems={state.display}
					displayLayout={state.layout}
					favorites={favoritesSet}
					handleExport={handleExport}
					selectedTags={state.tags}
					setColorFormat={setFormat}
					setDisplayItems={setDisplayItems}
					setDisplayLayout={setLayout}
					setFavorites={setFavorites}
					setSelectedTags={setSelectedTags}
					toggleTag={toggleTag}
				/>
				<Tags
					displayLayout={state.layout}
					favoritesCount={favoritesCount}
					selectedTags={state.tags}
					tagCounts={tagCounts}
					tags={allTags}
					toggleTag={toggleTag}
				/>
				<ColorPicker
					colorFormat={state.format}
					colors={colors}
					copiedColorKey={copiedColorKey}
					displayItems={state.display}
					displayLayout={state.layout}
					favorites={favoritesSet}
					filteredColors={filteredColors}
					handleCopy={handleCopy}
					selectedColor={selectedColor}
					onSelect={handleSelect}
					toggleFavorite={toggleFavorite}
					toggleTag={toggleTag}
				/>
			</div>
			{selectedColor && (
				<ColorChip
					color={selectedColor}
					format={state.format}
					toggleTag={toggleTag}
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
							const hide: ColorChipHideOptions[] = ["tags"];
							const stableId = getLiveId(color);
							const existsInCurrentLayout = !!color.layout[state.layout];
							const matchesActiveFilters =
								filteredColorKeys === null || filteredColorKeys.has(stableId);
							const isEffectivelyVisible =
								existsInCurrentLayout && matchesActiveFilters;

							return (
								<ColorChip
									key={`favourite-${stableId}`}
									color={color}
									existsInLayout={isEffectivelyVisible}
									format={state.format}
									hide={hide}
									toggleTag={toggleTag}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
