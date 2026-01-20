import { Heart, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ColorTag, DisplayLayout, colorGroupHexMap } from "@/data/colors";
import { cn } from "@/lib/utils";

export default function Tags({
	displayLayout,
	favoritesCount,
	selectedTags,
	setSelectedTags,
	setShowFavorites,
	showFavorites,
	tagCounts,
	tags,
	toggleTag,
}: {
	displayLayout: DisplayLayout;
	favoritesCount: number;
	selectedTags: ColorTag[];
	setSelectedTags: Dispatch<SetStateAction<ColorTag[]>>;
	setShowFavorites: Dispatch<SetStateAction<boolean>>;
	showFavorites: boolean;
	tagCounts: Record<ColorTag, number>;
	tags: ColorTag[];
	toggleTag: (tag: ColorTag) => void;
}) {
	const colorGroupTags = tags.filter((tag) => tag.startsWith("cg:"));
	const nonColorGroupTags = tags.filter((tag) => !tag.startsWith("cg:"));

	return (
		<div className="flex w-full flex-row flex-wrap gap-1">
			<div className="flex flex-wrap gap-1">
				{(selectedTags.length > 0 || showFavorites) && (
					<Button
						onClick={() => {
							setSelectedTags([]);
							setShowFavorites(false);
						}}
						variant={"outline"}
						disabled={!(selectedTags.length > 0 || showFavorites)}
						role="clear tags"
					>
						<X className="size-3" />
						<span>clear tag{selectedTags.length > 1 && "s"}</span>
					</Button>
				)}
				<Toggle
					variant={"outline"}
					disabled={favoritesCount === 0 && !showFavorites}
					pressed={showFavorites}
					onPressedChange={(pressed) => setShowFavorites(pressed)}
					role="favourites"
				>
					<Heart
						className="size-3"
						fill={favoritesCount === 0 ? "none" : "currentColor"}
					/>
					{favoritesCount > 0 && (
						<span className={"text-muted-foreground"}>· {favoritesCount}</span>
					)}
				</Toggle>
				{nonColorGroupTags.map((tag) => {
					const count = tagCounts[tag];
					const isDisabled = count === 0;
					return (
						<Toggle
							key={tag}
							variant={"outline"}
							disabled={isDisabled}
							pressed={selectedTags.includes(tag)}
							onPressedChange={() => toggleTag(tag)}
						>
							{tag}
							{count > 0 && (
								<span className={"text-muted-foreground"}>· {count}</span>
							)}
						</Toggle>
					);
				})}
				<ColorTags
					className={cn(displayLayout === "live" ? "relative lg:hidden" : "")}
					selectedTags={selectedTags}
					tagCounts={tagCounts}
					tags={colorGroupTags}
					toggleTag={toggleTag}
				/>
			</div>
			<div className="flex w-full flex-wrap gap-1 lg:flex-nowrap">
				{displayLayout === "live" && (
					<ColorTags
						className="hidden flex-1 lg:flex"
						selectedTags={selectedTags}
						tagCounts={tagCounts}
						tags={colorGroupTags}
						toggleTag={toggleTag}
					/>
				)}
			</div>
		</div>
	);
}

function ColorTags({
	className,
	selectedTags,
	tagCounts,
	toggleTag,
}: {
	className?: string;
	selectedTags: string[];
	tagCounts: Record<string, number>;
	tags: ColorTag[];
	toggleTag: (tag: string) => void;
}) {
	return (
		<>
			{Object.entries(colorGroupHexMap).map(([tag, tagColor], colIndex) => {
				const count = tagCounts[tag];
				const isDisabled = count === 0;
				return (
					<Toggle
						key={colIndex}
						disabled={isDisabled}
						variant={"outline"}
						pressed={selectedTags.includes(tag)}
						onPressedChange={() => toggleTag(tag)}
						className={cn("hover:opacity-70", className)}
						style={{
							backgroundColor: tagColor,
						}}
					>
						<span
							className={"text-dynamic-contrast"}
							style={{
								color: tagColor,
							}}
						>
							{tag.replace("cg:", "")}
						</span>
						{count > 0 && (
							<span
								className={"text-dynamic-contrast opacity-80"}
								style={{
									color: tagColor,
								}}
							>
								· {count}
							</span>
						)}
					</Toggle>
				);
			})}
		</>
	);
}
