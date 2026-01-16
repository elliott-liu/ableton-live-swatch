"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useMemo, useState } from "react";

type ColorFormat = "hex" | "rgb" | "hsl";

interface ColorData {
	col: number;
	row: number;
	hex: string;
	name: string;
	tags: string[];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return { r, g, b };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
	const { r, g, b } = hexToRgb(hex);
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;

	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case rNorm:
				h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
				break;
			case gNorm:
				h = ((bNorm - rNorm) / d + 2) / 6;
				break;
			case bNorm:
				h = ((rNorm - gNorm) / d + 4) / 6;
				break;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

const colors: ColorData[] = [
	// Red group
	{
		col: 1,
		row: 1,
		hex: "#ff94a6",
		name: "Salmon",
		tags: ["cg:red", "pastel", "warm"],
	},
	{
		col: 1,
		row: 2,
		hex: "#ff3636",
		name: "Fire Hydrant Red",
		tags: ["cg:red", "vibrant", "warm"],
	},
	{
		col: 1,
		row: 3,
		hex: "#e2675a",
		name: "Terracotta",
		tags: ["cg:red", "muted", "warm"],
	},
	{
		col: 1,
		row: 4,
		hex: "#c6928b",
		name: "Dusty Pink",
		tags: ["cg:red", "muted", "neutral"],
	},
	{
		col: 1,
		row: 5,
		hex: "#af3333",
		name: "Medium Carmine",
		tags: ["cg:red", "dark", "warm"],
	},
	// Orange group
	{
		col: 2,
		row: 1,
		hex: "#ffa529",
		name: "Frank Orange",
		tags: ["cg:orange", "vibrant", "warm"],
	},
	{
		col: 2,
		row: 2,
		hex: "#f66c03",
		name: "Tangerine",
		tags: ["cg:orange", "vibrant", "warm"],
	},
	{
		col: 2,
		row: 3,
		hex: "#ffa374",
		name: "Light Salmon",
		tags: ["cg:orange", "pastel", "warm"],
	},
	{
		col: 2,
		row: 4,
		hex: "#b78256",
		name: "Barley Corn",
		tags: ["cg:orange", "muted", "neutral"],
	},
	{
		col: 2,
		row: 5,
		hex: "#a95131",
		name: "Red Ochre",
		tags: ["cg:orange", "dark", "warm"],
	},
	// Amber group
	{
		col: 3,
		row: 1,
		hex: "#cc9927",
		name: "Dirty Gold",
		tags: ["cg:amber", "muted", "warm"],
	},
	{
		col: 3,
		row: 2,
		hex: "#99724b",
		name: "Sand",
		tags: ["cg:amber", "muted", "neutral"],
	},
	{
		col: 3,
		row: 3,
		hex: "#d3ad71",
		name: "Whiskey",
		tags: ["cg:amber", "muted", "warm"],
	},
	{
		col: 3,
		row: 4,
		hex: "#99836a",
		name: "Pale Oyster",
		tags: ["cg:amber", "muted", "neutral"],
	},
	{
		col: 3,
		row: 5,
		hex: "#724f41",
		name: "Coffee",
		tags: ["cg:amber", "dark", "neutral"],
	},
	// Yellow group
	{
		col: 4,
		row: 1,
		hex: "#f7f47c",
		name: "Lemonade",
		tags: ["cg:yellow", "pastel", "warm"],
	},
	{
		col: 4,
		row: 2,
		hex: "#fff034",
		name: "Sunshine Yellow",
		tags: ["cg:yellow", "vibrant", "warm"],
	},
	{
		col: 4,
		row: 3,
		hex: "#edffae",
		name: "Canary",
		tags: ["cg:yellow", "pastel", "cool"],
	},
	{
		col: 4,
		row: 4,
		hex: "#bfba69",
		name: "Dark Khaki",
		tags: ["cg:yellow", "muted", "warm"],
	},
	{
		col: 4,
		row: 5,
		hex: "#dbc300",
		name: "Durian Yellow",
		tags: ["cg:yellow", "vibrant", "warm"],
	},
	// Lime group
	{
		col: 5,
		row: 1,
		hex: "#bffb00",
		name: "Lime",
		tags: ["cg:lime", "vibrant", "cool"],
	},
	{
		col: 5,
		row: 2,
		hex: "#87ff67",
		name: "Terminal Green",
		tags: ["cg:lime", "vibrant", "cool"],
	},
	{
		col: 5,
		row: 3,
		hex: "#d2e498",
		name: "Primrose",
		tags: ["cg:lime", "pastel", "cool"],
	},
	{
		col: 5,
		row: 4,
		hex: "#a6be00",
		name: "Pistachio",
		tags: ["cg:lime", "muted", "cool"],
	},
	{
		col: 5,
		row: 5,
		hex: "#85961f",
		name: "Pomelo Green",
		tags: ["cg:lime", "dark", "cool"],
	},
	// Green group
	{
		col: 6,
		row: 1,
		hex: "#1aff2f",
		name: "Highlighter Green",
		tags: ["cg:green", "vibrant", "cool"],
	},
	{
		col: 6,
		row: 2,
		hex: "#3dc300",
		name: "Forest",
		tags: ["cg:green", "vibrant", "cool"],
	},
	{
		col: 6,
		row: 3,
		hex: "#bad074",
		name: "Wild Willow",
		tags: ["cg:green", "muted", "cool"],
	},
	{
		col: 6,
		row: 4,
		hex: "#7db04d",
		name: "Dollar Bill",
		tags: ["cg:green", "muted", "cool"],
	},
	{
		col: 6,
		row: 5,
		hex: "#539f31",
		name: "Apple",
		tags: ["cg:green", "dark", "cool"],
	},
	// Emerald group
	{
		col: 7,
		row: 1,
		hex: "#25ffa8",
		name: "Bianchi",
		tags: ["cg:emerald", "vibrant", "cool"],
	},
	{
		col: 7,
		row: 2,
		hex: "#00bfaf",
		name: "Tiffany Blue",
		tags: ["cg:emerald", "vibrant", "cool"],
	},
	{
		col: 7,
		row: 3,
		hex: "#9bc48d",
		name: "Dark Sea Green",
		tags: ["cg:emerald", "muted", "cool"],
	},
	{
		col: 7,
		row: 4,
		hex: "#88c2ba",
		name: "Neptune",
		tags: ["cg:emerald", "muted", "cool"],
	},
	{
		col: 7,
		row: 5,
		hex: "#0a9c8e",
		name: "Aquamarine",
		tags: ["cg:emerald", "dark", "cool"],
	},
	// Teal group
	{
		col: 8,
		row: 1,
		hex: "#5cffe8",
		name: "Turquoise",
		tags: ["cg:teal", "vibrant", "cool"],
	},
	{
		col: 8,
		row: 2,
		hex: "#19e9ff",
		name: "Cyan",
		tags: ["cg:teal", "vibrant", "cool"],
	},
	{
		col: 8,
		row: 3,
		hex: "#d4fde1",
		name: "Honeydew",
		tags: ["cg:teal", "pastel", "cool"],
	},
	{
		col: 8,
		row: 4,
		hex: "#9bb3c4",
		name: "Nepal",
		tags: ["cg:teal", "muted", "cool"],
	},
	{
		col: 8,
		row: 5,
		hex: "#236384",
		name: "Sea Blue",
		tags: ["cg:teal", "dark", "cool"],
	},
	// Sky group
	{
		col: 9,
		row: 1,
		hex: "#8bc5ff",
		name: "Sky Blue",
		tags: ["cg:sky", "pastel", "cool"],
	},
	{
		col: 9,
		row: 2,
		hex: "#10a4ee",
		name: "Cerulean",
		tags: ["cg:sky", "vibrant", "cool"],
	},
	{
		col: 9,
		row: 3,
		hex: "#cdf1f8",
		name: "Pale Turquoise",
		tags: ["cg:sky", "pastel", "cool"],
	},
	{
		col: 9,
		row: 4,
		hex: "#85a5c2",
		name: "Polo Blue",
		tags: ["cg:sky", "muted", "cool"],
	},
	{
		col: 9,
		row: 5,
		hex: "#1a2f96",
		name: "Cosmic Cobalt",
		tags: ["cg:sky", "dark", "cool"],
	},
	// Blue group
	{
		col: 10,
		row: 1,
		hex: "#5480e4",
		name: "Sapphire",
		tags: ["cg:blue", "vibrant", "cool"],
	},
	{
		col: 10,
		row: 2,
		hex: "#007dc0",
		name: "United Nations Blue",
		tags: ["cg:blue", "dark", "cool"],
	},
	{
		col: 10,
		row: 3,
		hex: "#b9c1e3",
		name: "Periwinkle",
		tags: ["cg:blue", "pastel", "cool"],
	},
	{
		col: 10,
		row: 4,
		hex: "#8393cc",
		name: "Vista Blue",
		tags: ["cg:blue", "muted", "cool"],
	},
	{
		col: 10,
		row: 5,
		hex: "#2f52a2",
		name: "Sapphire",
		tags: ["cg:blue", "dark", "cool"],
	},
	// Violet group
	{
		col: 11,
		row: 1,
		hex: "#92a7ff",
		name: "Periwinkle",
		tags: ["cg:violet", "pastel", "cool"],
	},
	{
		col: 11,
		row: 2,
		hex: "#886ce4",
		name: "Amethyst",
		tags: ["cg:violet", "vibrant", "cool"],
	},
	{
		col: 11,
		row: 3,
		hex: "#cdbbe4",
		name: "Fog",
		tags: ["cg:violet", "pastel", "cool"],
	},
	{
		col: 11,
		row: 4,
		hex: "#a595b5",
		name: "Amythyst Smoke",
		tags: ["cg:violet", "muted", "cool"],
	},
	{
		col: 11,
		row: 5,
		hex: "#624bad",
		name: "Plump Purple",
		tags: ["cg:violet", "dark", "cool"],
	},
	// Purple group
	{
		col: 12,
		row: 1,
		hex: "#d86ce4",
		name: "Orchid",
		tags: ["cg:purple", "vibrant", "warm"],
	},
	{
		col: 12,
		row: 2,
		hex: "#b677c6",
		name: "Iris",
		tags: ["cg:purple", "muted", "cool"],
	},
	{
		col: 12,
		row: 3,
		hex: "#ae98e5",
		name: "Dull Lavender",
		tags: ["cg:purple", "pastel", "cool"],
	},
	{
		col: 12,
		row: 4,
		hex: "#bf9fbe",
		name: "Lilac",
		tags: ["cg:purple", "muted", "cool"],
	},
	{
		col: 12,
		row: 5,
		hex: "#a34bad",
		name: "Purpureus",
		tags: ["cg:purple", "dark", "cool"],
	},
	// Pink group
	{
		col: 13,
		row: 1,
		hex: "#e553a0",
		name: "Magenta",
		tags: ["cg:pink", "vibrant", "warm"],
	},
	{
		col: 13,
		row: 2,
		hex: "#ff39d4",
		name: "Flamingo",
		tags: ["cg:pink", "vibrant", "warm"],
	},
	{
		col: 13,
		row: 3,
		hex: "#e5dce1",
		name: "Whisper",
		tags: ["cg:pink", "pastel", "neutral"],
	},
	{
		col: 13,
		row: 4,
		hex: "#bc7196",
		name: "Turkish Rose",
		tags: ["cg:pink", "muted", "warm"],
	},
	{
		col: 13,
		row: 5,
		hex: "#cc2e6e",
		name: "Fuscia Rose",
		tags: ["cg:pink", "dark", "warm"],
	},
	{
		col: 14,
		row: 1,
		hex: "#ffffff",
		name: "White",
		tags: ["cg:neutral", "pastel"],
	},
	{
		col: 14,
		row: 2,
		hex: "#d0d0d0",
		name: "Aluminum",
		tags: ["cg:neutral", "pastel", "neutral"],
	},
	{
		col: 14,
		row: 3,
		hex: "#a9a9a9",
		name: "Silver Chalice",
		tags: ["cg:neutral", "muted", "neutral"],
	},
	{
		col: 14,
		row: 4,
		hex: "#7b7b7b",
		name: "Steel",
		tags: ["cg:neutral", "muted", "neutral"],
	},
	{
		col: 14,
		row: 5,
		hex: "#3c3c3c",
		name: "Eclipse",
		tags: ["cg:neutral", "dark", "neutral"],
	},
];

const colorGroupOrder = [
	"cg:red",
	"cg:orange",
	"cg:amber",
	"cg:yellow",
	"cg:lime",
	"cg:green",
	"cg:emerald",
	"cg:teal",
	"cg:sky",
	"cg:blue",
	"cg:violet",
	"cg:purple",
	"cg:pink",
	"cg:neutral",
];

const otherTags = Array.from(new Set(colors.flatMap((c) => c.tags.filter((t) => !t.startsWith("cg:"))))).sort();

const TOTAL_COLS = 14;
const COLOR_SIZE = 55;
const GAP_SIZE = 4;
const TOTAL_WIDTH = TOTAL_COLS * COLOR_SIZE + (TOTAL_COLS - 1) * GAP_SIZE;

const colorGroupHexMap: Record<string, string> = {
	"cg:red": "#ff3636",
	"cg:orange": "#f66c03",
	"cg:amber": "#cc9927",
	"cg:yellow": "#fff034",
	"cg:lime": "#bffb00",
	"cg:green": "#3dc300",
	"cg:emerald": "#00bfaf",
	"cg:teal": "#19e9ff",
	"cg:sky": "#10a4ee",
	"cg:blue": "#007dc0",
	"cg:violet": "#886ce4",
	"cg:purple": "#b677c6",
	"cg:pink": "#ff39d4",
	"cg:neutral": "#7b7b7b",
};

function formatColor(color: ColorData, format: ColorFormat): string {
	switch (format) {
		case "hex":
			return color.hex;
		case "rgb": {
			const rgb = hexToRgb(color.hex);
			return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
		}
		case "hsl": {
			const hsl = hexToHsl(color.hex);
			return `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
		}
	}
}

function getContrastColor(hex: string): string {
	const { r, g, b } = hexToRgb(hex);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function ColorPicker() {
	const [format, setFormat] = useState<ColorFormat>("hex");
	const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
	const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

	const filteredColorKeys = useMemo(() => {
		const hasFavoritesFilter = showFavoritesOnly;
		const hasTagFilters = selectedTags.length > 0;

		if (!hasFavoritesFilter && !hasTagFilters) return null;

		const filtered = colors.filter((color) => {
			const key = `${color.col}-${color.row}`;
			const matchesFavorites = !hasFavoritesFilter || favorites.has(key);
			const matchesTags = selectedTags.every((tag) => color.tags.includes(tag));
			return matchesFavorites && matchesTags;
		});
		return new Set(filtered.map((c) => `${c.col}-${c.row}`));
	}, [selectedTags, showFavoritesOnly, favorites]);

	const tagCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const tag of otherTags) {
			const tagsToCheck = selectedTags.includes(tag) ? selectedTags : [...selectedTags, tag];
			const matchingColors = colors.filter((color) => {
				const key = `${color.col}-${color.row}`;
				const matchesFavorites = !showFavoritesOnly || favorites.has(key);
				return matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t));
			});
			counts[tag] = matchingColors.length;
		}
		return counts;
	}, [selectedTags, showFavoritesOnly, favorites]);

	const colorGroupCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const tag of colorGroupOrder) {
			const tagsToCheck = selectedTags.includes(tag) ? selectedTags : [...selectedTags.filter((t) => !t.startsWith("cg:")), tag];
			const matchingColors = colors.filter((color) => {
				const key = `${color.col}-${color.row}`;
				const matchesFavorites = !showFavoritesOnly || favorites.has(key);
				return matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t));
			});
			counts[tag] = matchingColors.length;
		}
		return counts;
	}, [selectedTags, showFavoritesOnly, favorites]);

	const favoritesCount = useMemo(() => {
		if (showFavoritesOnly) {
			return favorites.size;
		}
		return colors.filter((color) => {
			const key = `${color.col}-${color.row}`;
			return favorites.has(key) && selectedTags.every((tag) => color.tags.includes(tag));
		}).length;
	}, [favorites, selectedTags, showFavoritesOnly]);

	const favoriteColors = useMemo(() => {
		return colors.filter((color) => favorites.has(`${color.col}-${color.row}`));
	}, [favorites]);

	const rows = 5;
	const grid = Array.from({ length: rows }, (_, rowIndex) =>
		Array.from({ length: TOTAL_COLS }, (_, colIndex) => {
			const color = colors.find((c) => c.row === rowIndex + 1 && c.col === colIndex + 1);
			if (!color) return null;
			const isActive = filteredColorKeys === null || filteredColorKeys.has(`${color.col}-${color.row}`);
			return { color, isActive };
		})
	);

	const handleCopy = async (color: ColorData) => {
		const value = formatColor(color, format);
		await navigator.clipboard.writeText(value);
		const key = `${color.col}-${color.row}`;
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
		const key = `${color.col}-${color.row}`;
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
		const filteredColors = filteredColorKeys === null ? colors : colors.filter((c) => filteredColorKeys.has(`${c.col}-${c.row}`));

		const exportData = {
			format,
			selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
			showFavoritesOnly: showFavoritesOnly || undefined,
			colors: filteredColors.map((c) => ({
				name: c.name,
				value: formatColor(c, format),
				tags: c.tags,
				isFavorite: favorites.has(`${c.col}-${c.row}`) || undefined,
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
				<h2 className="text-lg font-semibold text-foreground">Ableton Live Colors</h2>
				<div className="flex items-center gap-2">
					{favorites.size > 0 && (
						<button
							onClick={() => {
								setFavorites(new Set());
								setShowFavoritesOnly(false);
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
					<ToggleGroup type="single" value={format} onValueChange={(value) => value && setFormat(value as ColorFormat)} className="gap-1">
						<ToggleGroupItem
							value="hex"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none border border-border shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							hex
						</ToggleGroupItem>
						<ToggleGroupItem
							value="rgb"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none border border-border shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							rgb
						</ToggleGroupItem>
						<ToggleGroupItem
							value="hsl"
							className="h-auto px-2 py-0.5 text-xs font-medium rounded-none border border-border shadow-none data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:border-foreground"
						>
							hsl
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>

			<div className="flex flex-col gap-1">
				<div className="flex flex-wrap gap-1">
					<button
						onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
						disabled={favoritesCount === 0 && !showFavoritesOnly}
						className={cn(
							"px-2 py-0.5 text-xs border transition-colors flex items-center gap-1",
							favoritesCount === 0 && !showFavoritesOnly
								? "bg-muted text-muted-foreground/50 border-border/50 cursor-not-allowed"
								: showFavoritesOnly
								? "bg-foreground text-background border-foreground"
								: "bg-background text-foreground border-border hover:bg-muted"
						)}
					>
						<Heart className="w-3 h-3" fill={showFavoritesOnly ? "currentColor" : "none"} />
						{favoritesCount > 0 && (
							<span className={cn(showFavoritesOnly ? "text-background/60" : "text-muted-foreground")}>· {favoritesCount}</span>
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
					{(selectedTags.length > 0 || showFavoritesOnly) && (
						<button
							onClick={() => {
								setSelectedTags([]);
								setShowFavoritesOnly(false);
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
							{colorGroupOrder.map((tag, colIndex) => {
								const tagColor = colorGroupHexMap[tag] || "#888888";
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
									const colorKey = `${color.col}-${color.row}`;
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
													onClick={() => {
														setSelectedColor(color);
														handleCopy(color);
													}}
													onDoubleClick={(e) => {
														e.preventDefault();
														toggleFavorite(color);
													}}
													className={cn(
														"relative transition-all hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center",
														selectedColor?.hex === color.hex && "ring-2 ring-foreground"
													)}
													style={{ width: `${COLOR_SIZE}px`, height: `${COLOR_SIZE}px`, backgroundColor: color.hex }}
													aria-label={`Select ${color.name}`}
												>
													{isFavorited && (
														<Heart
															className="w-3 h-3 absolute top-1 left-1 opacity-25"
															fill="currentColor"
															style={{ color: getContrastColor(color.hex) }}
														/>
													)}
													{copiedColorKey === colorKey && (
														<span
															className="text-[10px] font-medium animate-in fade-in-0 zoom-in-95"
															style={{ color: getContrastColor(color.hex) }}
														>
															copied
														</span>
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												className="px-3 py-2 text-sm font-medium rounded-none border-none"
												style={{ backgroundColor: color.hex, color: getContrastColor(color.hex) }}
												arrowClassName="rounded-none"
												arrowStyle={{ backgroundColor: color.hex, fill: color.hex }}
											>
												<div className="flex items-center gap-2">
													<p className="font-semibold">{color.name}</p>
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleFavorite(color);
														}}
														className="hover:opacity-80 transition-opacity"
													>
														<Heart className="w-3.5 h-3.5" fill="currentColor" />
													</button>
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
															className="px-1.5 py-0.5 text-xs lowercase transition-opacity hover:opacity-80"
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
									className="px-1.5 py-0.5 text-xs lowercase transition-opacity hover:opacity-80"
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
							const colorKey = `${color.col}-${color.row}`;
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
									{copiedColorKey === colorKey && <span className="text-[10px] font-medium animate-in fade-in-0 zoom-in-95">copied</span>}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
