import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import ThemeProvider from "@/theme/ThemeProvider";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ableton Live Swatch",
	description:
		"A tool to explore and manage Ableton Live's colour palette, including tags, favorites, and export options.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="light" style={{ colorScheme: "light" }}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} mx-auto max-w-7xl px-4 antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
