import ThemeToggle from "@/theme/ThemeToggle";

export default function Navbar() {
	return (
		<header className="h-12 w-full">
			<div className="flex h-full items-center justify-between">
				<h1 className="text-lg font-semibold text-foreground">
					Ableton Live Swatch
				</h1>
				<ThemeToggle />
			</div>
		</header>
	);
}
