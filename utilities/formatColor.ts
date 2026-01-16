import { ColorData } from "@/data/colors";
import { hexToHsl } from "@/utilities/hexToHsl";
import { hexToRgb } from "@/utilities/hexToRgb";

export type ColorFormat = "hex" | "rgb" | "hsl";

export function formatColor(color: ColorData, format: ColorFormat): string {
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
