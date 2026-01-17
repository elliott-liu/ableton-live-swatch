import { ColorData, ColorTag, DisplayLayout } from "@/data/colors";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";

export default function Tags({
	colors,
	displayLayout,
	favorites,
	favoritesCount,
	selectedTags,
	setSelectedTags,
	setShowFavorites,
	showFavorites,
	tags,
	toggleTag,
}: {
	colors: ColorData[];
	displayLayout: DisplayLayout;
	favorites: Set<string>;
	favoritesCount: number;
	selectedTags: string[];
	setSelectedTags: Dispatch<SetStateAction<string[]>>;
	setShowFavorites: Dispatch<SetStateAction<boolean>>;
	showFavorites: boolean;
	tags: ColorTag[];
	toggleTag: (tag: string) => void;
}) {
	const tagCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const tag of tags) {
			const tagsToCheck = selectedTags.includes(tag) ? selectedTags : [...selectedTags, tag];
			const matchingColors = colors.filter((color) => {
				const layoutData = color.layout[displayLayout];
				if (!layoutData) return false;

				const key = `${layoutData.col}-${layoutData.row}`;
				const matchesFavorites = !showFavorites || favorites.has(key);

				return matchesFavorites && tagsToCheck.every((t) => color.tags.includes(t));
			});
			counts[tag] = matchingColors.length;
		}

		return counts;
	}, [selectedTags, showFavorites, favorites, displayLayout]);

	return (
		<div className="flex flex-wrap gap-1">
			<button
				onClick={() => setShowFavorites(!showFavorites)}
				disabled={favoritesCount === 0 && !showFavorites}
				className={cn(
					"px-2 py-0.5 text-xs border transition-colors flex items-center gap-1",
					favoritesCount === 0 && !showFavorites
						? "bg-muted text-muted-foreground/50 border-border/50 cursor-not-allowed"
						: showFavorites
						? "bg-foreground text-background border-foreground"
						: "bg-background text-foreground border-border hover:bg-muted"
				)}
			>
				<Heart className="w-3 h-3" fill={favoritesCount === 0 ? "none" : "currentColor"} />
				{favoritesCount > 0 && (
					<span className={cn(showFavorites ? "text-background/60" : "text-muted-foreground")}>· {favoritesCount}</span>
				)}
			</button>
			{tags.map((tag) => {
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
							<span className={cn("ml-0.5", selectedTags.includes(tag) ? "text-background/60" : "text-muted-foreground")}>· {count}</span>
						)}
					</button>
				);
			})}
			{(selectedTags.length > 0 || showFavorites) && (
				<button
					onClick={() => {
						setSelectedTags([]);
						setShowFavorites(false);
					}}
					className="px-2 py-0.5 text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					clear all
				</button>
			)}
		</div>
	);
}
