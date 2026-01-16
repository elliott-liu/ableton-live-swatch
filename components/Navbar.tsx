import ThemeToggle from "@/theme/ThemeToggle";

export default function Navbar() {
	return (
		<header className="sticky top-0 z-10 h-11 w-full">
			<div className="flex h-full max-w-7xl mx-auto justify-between items-center px-4">
				<h1 className="text-lg font-semibold text-foreground">Ableton Live Swatch</h1>
				<ThemeToggle />
			</div>
		</header>
	);
}
