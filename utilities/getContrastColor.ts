import { hexToRgb } from "@/utilities/hexToRgb";

export function getContrastColor(hex: string): string {
	const { r, g, b } = hexToRgb(hex);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
