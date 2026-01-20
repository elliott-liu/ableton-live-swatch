import { hexToRgb } from "@/utilities/hexToRgb";

function getLuminance(r: number, g: number, b: number): number {
	const [rNormalized, gNormalized, bNormalized] = [r, g, b].map((c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rNormalized + 0.7152 * gNormalized + 0.0722 * bNormalized;
}

function getContrastRatio(luminance1: number, luminance2: number): number {
	const lighter = Math.max(luminance1, luminance2);
	const darker = Math.min(luminance1, luminance2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastColor(hex: string): string {
	const { r, g, b } = hexToRgb(hex);
	const backgroundLuminance = getLuminance(r, g, b);

	const blackLuminance = getLuminance(0, 0, 0);
	const whiteLuminance = getLuminance(255, 255, 255);

	const contrastWithBlack = getContrastRatio(
		backgroundLuminance,
		blackLuminance,
	);
	const contrastWithWhite = getContrastRatio(
		backgroundLuminance,
		whiteLuminance,
	);

	// WCAG 2.1 AA standard for normal text is 4.5:1
	// WCAG 2.1 AA standard for large text or UI components is 3:1
	const MIN_CONTRAST = 4.5;

	if (contrastWithWhite >= MIN_CONTRAST) {
		return "#FFFFFF";
	} else if (contrastWithBlack >= MIN_CONTRAST) {
		return "#000000";
	} else {
		return contrastWithWhite > contrastWithBlack ? "#FFFFFF" : "#000000";
	}
}
