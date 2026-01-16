"use client";
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return { r, g, b };
}
