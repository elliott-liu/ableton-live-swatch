import { PartialBy } from "@/types/PartialBy";
import { Prepend } from "@/types/Prepend";

const colorGroupings = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"sky",
	"blue",
	"violet",
	"purple",
	"pink",
	"neutral",
] as const;

type ColorGroupings = (typeof colorGroupings)[number];
type ColorGroupTags = Prepend<ColorGroupings, "cg:">;
type ColorGroupTag = ColorGroupTags[number];

export function assertColorGroupTag(
	value: unknown,
): asserts value is ColorGroupTag {
	const prefixedColorGroupings = colorGroupings.map((group) => `cg:${group}`);

	if (
		typeof value !== "string" ||
		!prefixedColorGroupings.includes(value as ColorGroupTag)
	) {
		throw new Error(`Value "${value}" is not a valid ColorGroupTag.`);
	}
}

export type DefinedColorTag =
	| "push"
	| "vibrant"
	| "muted"
	| "dark"
	| "pastel"
	| "warm"
	| "cool"
	| "neutral";
export type ColorTag = ColorGroupTag | DefinedColorTag | (string & {});

type Layout = { col: number; row: number };

export const displayLayouts = ["live", "push"] as const;
export type DisplayLayout = (typeof displayLayouts)[number];

export type DisplayLayoutsRecord = {
	[K in DisplayLayout]: Layout;
};

export type DisplayLayouts = PartialBy<DisplayLayoutsRecord, "push">;

export interface ColorData {
	layout: DisplayLayouts;
	hex: string;
	name: string;
	tags: ColorTag[];
}

export const colors: ColorData[] = [
	// Red group
	{
		layout: {
			live: { col: 1, row: 1 },
			push: { col: 3, row: 8 },
		},
		hex: "#ff94a6",
		name: "Salmon",
		tags: ["cg:red", "push", "pastel", "warm"],
	},
	{
		layout: {
			live: { col: 1, row: 2 },
			push: { col: 2, row: 8 },
		},
		hex: "#ff3636",
		name: "Fire Hydrant Red",
		tags: ["cg:red", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 1, row: 3 },
		},
		hex: "#e2675a",
		name: "Terracotta",
		tags: ["cg:red", "muted", "warm"],
	},
	{
		layout: {
			live: { col: 1, row: 4 },
		},
		hex: "#c6928b",
		name: "Dusty Pink",
		tags: ["cg:red", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 1, row: 5 },
		},
		hex: "#af3333",
		name: "Medium Carmine",
		tags: ["cg:red", "dark", "warm"],
	},
	// Orange group
	{
		layout: {
			live: { col: 2, row: 1 },
			push: { col: 1, row: 8 },
		},
		hex: "#ffa529",
		name: "Frank Orange",
		tags: ["cg:orange", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 2, row: 2 },
			push: { col: 1, row: 7 },
		},
		hex: "#f66c03",
		name: "Tangerine",
		tags: ["cg:orange", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 2, row: 3 },
		},
		hex: "#ffa374",
		name: "Light Salmon",
		tags: ["cg:orange", "pastel", "warm"],
	},
	{
		layout: {
			live: { col: 2, row: 4 },
		},
		hex: "#b78256",
		name: "Barley Corn",
		tags: ["cg:orange", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 2, row: 5 },
		},
		hex: "#a95131",
		name: "Red Ochre",
		tags: ["cg:orange", "dark", "warm"],
	},
	// Amber group
	{
		layout: {
			live: { col: 3, row: 1 },
			push: { col: 1, row: 5 },
		},
		hex: "#cc9927",
		name: "Dirty Gold",
		tags: ["cg:amber", "push", "muted", "warm"],
	},
	{
		layout: {
			live: { col: 3, row: 2 },
			push: { col: 1, row: 6 },
		},
		hex: "#99724b",
		name: "Sand",
		tags: ["cg:amber", "push", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 3, row: 3 },
		},
		hex: "#d3ad71",
		name: "Whiskey",
		tags: ["cg:amber", "muted", "warm"],
	},
	{
		layout: {
			live: { col: 3, row: 4 },
		},
		hex: "#99836a",
		name: "Pale Oyster",
		tags: ["cg:amber", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 3, row: 5 },
		},
		hex: "#724f41",
		name: "Coffee",
		tags: ["cg:amber", "dark", "neutral"],
	},
	// Yellow group
	{
		layout: {
			live: { col: 4, row: 1 },
			push: { col: 1, row: 4 },
		},
		hex: "#f7f47c",
		name: "Lemonade",
		tags: ["cg:yellow", "push", "pastel", "warm"],
	},
	{
		layout: {
			live: { col: 4, row: 2 },
			push: { col: 1, row: 3 },
		},
		hex: "#fff034",
		name: "Sunshine Yellow",
		tags: ["cg:yellow", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 4, row: 3 },
		},
		hex: "#edffae",
		name: "Canary",
		tags: ["cg:yellow", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 4, row: 4 },
		},
		hex: "#bfba69",
		name: "Dark Khaki",
		tags: ["cg:yellow", "muted", "warm"],
	},
	{
		layout: {
			live: { col: 4, row: 5 },
		},
		hex: "#dbc300",
		name: "Durian Yellow",
		tags: ["cg:yellow", "vibrant", "warm"],
	},
	// Lime group
	{
		layout: {
			live: { col: 5, row: 1 },
			push: { col: 1, row: 2 },
		},
		hex: "#bffb00",
		name: "Lime",
		tags: ["cg:lime", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 5, row: 2 },
			push: { col: 1, row: 1 },
		},
		hex: "#87ff67",
		name: "Terminal Green",
		tags: ["cg:lime", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 5, row: 3 },
		},
		hex: "#d2e498",
		name: "Primrose",
		tags: ["cg:lime", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 5, row: 4 },
		},
		hex: "#a6be00",
		name: "Pistachio",
		tags: ["cg:lime", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 5, row: 5 },
		},
		hex: "#85961f",
		name: "Pomelo Green",
		tags: ["cg:lime", "dark", "cool"],
	},
	// Green group
	{
		layout: {
			live: { col: 6, row: 1 },
			push: { col: 2, row: 1 },
		},
		hex: "#1aff2f",
		name: "Highlighter Green",
		tags: ["cg:green", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 6, row: 2 },
			push: { col: 3, row: 1 },
		},
		hex: "#3dc300",
		name: "Forest",
		tags: ["cg:green", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 6, row: 3 },
		},
		hex: "#bad074",
		name: "Wild Willow",
		tags: ["cg:green", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 6, row: 4 },
		},
		hex: "#7db04d",
		name: "Dollar Bill",
		tags: ["cg:green", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 6, row: 5 },
		},
		hex: "#539f31",
		name: "Apple",
		tags: ["cg:green", "dark", "cool"],
	},
	// Emerald group
	{
		layout: {
			live: { col: 7, row: 1 },
			push: { col: 4, row: 1 },
		},
		hex: "#25ffa8",
		name: "Bianchi",
		tags: ["cg:emerald", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 7, row: 2 },
			push: { col: 5, row: 1 },
		},
		hex: "#00bfaf",
		name: "Tiffany Blue",
		tags: ["cg:emerald", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 7, row: 3 },
		},
		hex: "#9bc48d",
		name: "Dark Sea Green",
		tags: ["cg:emerald", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 7, row: 4 },
		},
		hex: "#88c2ba",
		name: "Neptune",
		tags: ["cg:emerald", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 7, row: 5 },
		},
		hex: "#0a9c8e",
		name: "Aquamarine",
		tags: ["cg:emerald", "dark", "cool"],
	},
	// Teal group
	{
		layout: {
			live: { col: 8, row: 1 },
			push: { col: 6, row: 1 },
		},
		hex: "#5cffe8",
		name: "Turquoise",
		tags: ["cg:teal", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 8, row: 2 },
			push: { col: 7, row: 1 },
		},
		hex: "#19e9ff",
		name: "Cyan",
		tags: ["cg:teal", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 8, row: 3 },
		},
		hex: "#d4fde1",
		name: "Honeydew",
		tags: ["cg:teal", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 8, row: 4 },
		},
		hex: "#9bb3c4",
		name: "Nepal",
		tags: ["cg:teal", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 8, row: 5 },
		},
		hex: "#236384",
		name: "Sea Blue",
		tags: ["cg:teal", "dark", "cool"],
	},
	// Sky group
	{
		layout: {
			live: { col: 9, row: 1 },
			push: { col: 8, row: 1 },
		},
		hex: "#8bc5ff",
		name: "Sky Blue",
		tags: ["cg:sky", "push", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 9, row: 2 },
			push: { col: 8, row: 2 },
		},
		hex: "#10a4ee",
		name: "Cerulean",
		tags: ["cg:sky", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 9, row: 3 },
		},
		hex: "#cdf1f8",
		name: "Pale Turquoise",
		tags: ["cg:sky", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 9, row: 4 },
		},
		hex: "#85a5c2",
		name: "Polo Blue",
		tags: ["cg:sky", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 9, row: 5 },
		},
		hex: "#1a2f96",
		name: "Cosmic Cobalt",
		tags: ["cg:sky", "dark", "cool"],
	},
	// Blue group
	{
		layout: {
			live: { col: 10, row: 1 },
			push: { col: 8, row: 3 },
		},
		hex: "#5480e4",
		name: "Sapphire",
		tags: ["cg:blue", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 10, row: 2 },
			push: { col: 8, row: 4 },
		},
		hex: "#007dc0",
		name: "United Nations Blue",
		tags: ["cg:blue", "push", "dark", "cool"],
	},
	{
		layout: {
			live: { col: 10, row: 3 },
		},
		hex: "#b9c1e3",
		name: "Periwinkle",
		tags: ["cg:blue", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 10, row: 4 },
		},
		hex: "#8393cc",
		name: "Vista Blue",
		tags: ["cg:blue", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 10, row: 5 },
		},
		hex: "#2f52a2",
		name: "Sapphire",
		tags: ["cg:blue", "dark", "cool"],
	},
	// Violet group
	{
		layout: {
			live: { col: 11, row: 1 },
			push: { col: 8, row: 5 },
		},
		hex: "#92a7ff",
		name: "Periwinkle",
		tags: ["cg:violet", "push", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 11, row: 2 },
			push: { col: 8, row: 6 },
		},
		hex: "#886ce4",
		name: "Amethyst",
		tags: ["cg:violet", "push", "vibrant", "cool"],
	},
	{
		layout: {
			live: { col: 11, row: 3 },
		},
		hex: "#cdbbe4",
		name: "Fog",
		tags: ["cg:violet", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 11, row: 4 },
		},
		hex: "#a595b5",
		name: "Amethyst Smoke",
		tags: ["cg:violet", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 11, row: 5 },
		},
		hex: "#624bad",
		name: "Plump Purple",
		tags: ["cg:violet", "dark", "cool"],
	},
	// Purple group
	{
		layout: {
			live: { col: 12, row: 1 },
			push: { col: 8, row: 7 },
		},
		hex: "#d86ce4",
		name: "Orchid",
		tags: ["cg:purple", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 12, row: 2 },
			push: { col: 8, row: 8 },
		},
		hex: "#b677c6",
		name: "Iris",
		tags: ["cg:purple", "push", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 12, row: 3 },
		},
		hex: "#ae98e5",
		name: "Dull Lavender",
		tags: ["cg:purple", "pastel", "cool"],
	},
	{
		layout: {
			live: { col: 12, row: 4 },
		},
		hex: "#bf9fbe",
		name: "Lilac",
		tags: ["cg:purple", "muted", "cool"],
	},
	{
		layout: {
			live: { col: 12, row: 5 },
		},
		hex: "#a34bad",
		name: "Purpureus",
		tags: ["cg:purple", "dark", "cool"],
	},
	// Pink group
	{
		layout: {
			live: { col: 13, row: 1 },
			push: { col: 7, row: 8 },
		},
		hex: "#e553a0",
		name: "Magenta",
		tags: ["cg:pink", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 13, row: 2 },
			push: { col: 6, row: 8 },
		},
		hex: "#ff39d4",
		name: "Flamingo",
		tags: ["cg:pink", "push", "vibrant", "warm"],
	},
	{
		layout: {
			live: { col: 13, row: 3 },
		},
		hex: "#e5dce1",
		name: "Whisper",
		tags: ["cg:pink", "pastel", "neutral"],
	},
	{
		layout: {
			live: { col: 13, row: 4 },
		},
		hex: "#bc7196",
		name: "Turkish Rose",
		tags: ["cg:pink", "muted", "warm"],
	},
	{
		layout: {
			live: { col: 13, row: 5 },
		},
		hex: "#cc2e6e",
		name: "Fuscia Rose",
		tags: ["cg:pink", "dark", "warm"],
	},
	{
		layout: {
			live: { col: 14, row: 1 },
		},
		hex: "#ffffff",
		name: "White",
		tags: ["cg:neutral", "pastel"],
	},
	{
		layout: {
			live: { col: 14, row: 2 },
		},
		hex: "#d0d0d0",
		name: "Aluminum",
		tags: ["cg:neutral", "pastel", "neutral"],
	},
	{
		layout: {
			live: { col: 14, row: 3 },
		},
		hex: "#a9a9a9",
		name: "Silver Chalice",
		tags: ["cg:neutral", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 14, row: 4 },
		},
		hex: "#7b7b7b",
		name: "Steel",
		tags: ["cg:neutral", "muted", "neutral"],
	},
	{
		layout: {
			live: { col: 14, row: 5 },
		},
		hex: "#3c3c3c",
		name: "Eclipse",
		tags: ["cg:neutral", "dark", "neutral"],
	},
];

export const colorGroupHexMap: Record<ColorGroupTag, string> = colors
	.filter((color) => color.layout.live.row === 2)
	.reduce(
		(acc, color) => {
			const foundTag = color.tags.find((tag) => tag.startsWith("cg:"));
			assertColorGroupTag(foundTag);
			acc[foundTag] = color.hex;
			return acc;
		},
		{} as Record<ColorGroupTag, string>,
	);
