"use client";

import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ColorChip from "@/components/ColorChip";
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

	const setFormat = (format: ColorFormat) => updateState({ format });
	const setLayout = (layout: DisplayLayout) => updateState({ layout });
	const setSelectedTags = (tags: ColorTag[]) => updateState({ tags });
	const setDisplayItems = (display: DisplayItem[]) => updateState({ display });
	const setFavorites = (favorites: ColorCoordinateId[]) =>
		updateState({ favorites });

	const toggleTag = (itemOrItems: ColorTag | ColorTag[]) => {
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

		setSelectedTags(newTags);
	};

	const [copiedColorKey, setCopiedColorKey] =
		useState<ColorCoordinateId | null>(null);
	const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);

	const favorites = useMemo(() => new Set(state.favorites), [state.favorites]);

	const filteredColors = useMemo(() => {
		const onlyShowFavorites = state.tags.includes("favorite");
		const metadataTags = state.tags.filter((t) => t !== "favorite");

		if (state.tags.length === 0) return colors;

		return colors.filter((color) => {
			const layoutData = color.layout[state.layout];
			if (!layoutData) return false;

			const stableId = getLiveId(color);
			const matchesFavorites = !onlyShowFavorites || favorites.has(stableId);
			const matchesTags = metadataTags.every((tag) => color.tags.includes(tag));

			return matchesFavorites && matchesTags;
		});
	}, [colors, state.tags, state.layout, favorites]);

	const filteredColorKeys = useMemo(() => {
		if (!state.tags.includes("favorite") && state.tags.length === 0)
			return null;

		return new Set(
			filteredColors
				.map((c) => c.layout[state.layout])
				.filter(Boolean)
				.map((layoutData) => {
					if (!layoutData) {
						console.warn(
							"Attempted to filter a color without layout data for the current display layout.",
						);
						return;
					}

					const key: ColorCoordinateId = `${layoutData.col}-${layoutData.row}`;
					return key;
				}),
		);
	}, [filteredColors, state.layout, state.tags]);

	useEffect(() => {
		if (selectedColor) {
			const selectedLayoutData = selectedColor.layout[state.layout];
			if (selectedLayoutData) {
				const selectedColorKey: ColorCoordinateId = `${selectedLayoutData.col}-${selectedLayoutData.row}`;
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
	}, [selectedColor, filteredColorKeys, filteredColors, state.layout]);

	const favoritesCount = useMemo(() => {
		const metadataTags = state.tags.filter((t) => t !== "favorite");

		return colors.filter((color) => {
			const isFavorite = favorites.has(getLiveId(color));
			const existsInCurrentLayout = !!color.layout[state.layout];
			const matchesTags = metadataTags.every((tag) => color.tags.includes(tag));
			return existsInCurrentLayout && isFavorite && matchesTags;
		}).length;
	}, [favorites, state.tags, state.layout]);

	const favoriteColors = useMemo(() => {
		return colors.filter((color) => {
			const isFavorite = favorites.has(getLiveId(color));
			return isFavorite;
		});
	}, [favorites, state.layout]);

	useEffect(() => {
		if (favoritesCount === 0 && state.tags.includes("favorite")) {
			toggleTag("favorite");
		}
	}, [favoritesCount, state.tags, updateState]);

	const handleCopy = async (color: ColorData) => {
		const value = formatColor(color, state.format);
		await navigator.clipboard.writeText(value);

		const layoutData = color.layout[state.layout];
		if (layoutData) {
			const key: ColorCoordinateId = `${layoutData.col}-${layoutData.row}`;
			setCopiedColorKey(key);
			setTimeout(() => setCopiedColorKey(null), 1500);
		} else {
			console.warn(
				"Attempted to copy a color without layout data for the current display layout.",
			);
			setCopiedColorKey(null);
		}
	};

	const toggleFavorite = (color: ColorData) => {
		const key: ColorCoordinateId = getLiveId(color);
		const isFavorite = state.favorites.includes(key);
		const nextFavorites = isFavorite
			? state.favorites.filter((id) => id !== key)
			: [...state.favorites, key];
		setFavorites(nextFavorites);
	};

	const tags = Array.from(new Set(colors.flatMap((c) => c.tags))).sort();

	const tagCounts = useMemo(() => {
		const counts: Record<ColorTag, number> = {};

		for (const tag of tags) {
			const metadataTagsToCheck = state.tags.includes(tag)
				? state.tags.filter((t) => t !== "favorite")
				: [...state.tags.filter((t) => t !== "favorite"), tag];

			const isFilteringFavorite = state.tags.includes("favorite");

			const matchingColors = colors.filter((color) => {
				if (!color.layout[state.layout]) return false;

				const stableId = getLiveId(color);
				const matchesFavorite = !isFilteringFavorite || favorites.has(stableId);

				const matchesMetadata = metadataTagsToCheck.every((t) =>
					color.tags.includes(t),
				);

				return matchesFavorite && matchesMetadata;
			});
			counts[tag] = matchingColors.length;
		}

		return counts;
	}, [state.tags, favorites, state.layout]);

	const handleExport = () => {
		const colorsToExport = filteredColors;

		const exportData = {
			format: state.format,
			selectedTags: state.tags.length > 0 ? state.tags : undefined,
			showFavoritesOnly: state.tags.includes("favorite") || undefined,
			colors: colorsToExport.map((c) => {
				const layoutData = c.layout[state.layout];

				const favoriteKey: ColorCoordinateId | null = layoutData
					? `${layoutData.col}-${layoutData.row}`
					: null;

				return {
					name: c.name,
					value: formatColor(c, state.format),
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
		a.download = `ableton-colors-${state.format}-${state.layout}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col gap-1 md:gap-2 lg:gap-4">
			<div className="flex w-full flex-col items-center gap-1">
				<Tools
					colorFormat={state.format}
					displayItems={state.display}
					displayLayout={state.layout}
					favorites={favorites}
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
					tags={tags}
					toggleTag={toggleTag}
				/>
				<ColorPicker
					colorFormat={state.format}
					colors={colors}
					copiedColorKey={copiedColorKey}
					displayItems={state.display}
					displayLayout={state.layout}
					favorites={favorites}
					filteredColors={filteredColors}
					handleCopy={handleCopy}
					selectedColor={selectedColor}
					setSelectedColor={setSelectedColor}
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
							const stableId = getLiveId(color);
							const existsInCurrentLayout = !!color.layout[state.layout];
							const matchesActiveFilters =
								filteredColorKeys === null || filteredColorKeys.has(stableId);
							const isEffectivelyVisible =
								existsInCurrentLayout && matchesActiveFilters;

							return (
								<ColorChip
									key={stableId}
									color={color}
									existsInLayout={isEffectivelyVisible}
									format={state.format}
									hide={["tags"]}
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
