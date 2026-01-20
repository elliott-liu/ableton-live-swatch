"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			color="default"
			border="none"
			size="icon-sm"
			title="Toggle theme"
			aria-label="Toggle theme"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<Sun className="hidden size-3 dark:block" />
			<Moon className="size-3 dark:hidden" />
		</Button>
	);
}
