import { Heart } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { ColorTag, DisplayLayout, colorGroupHexMap } from "@/data/colors";
import { cn } from "@/lib/utils";
import { getContrastColor } from "@/utilities/getContrastColor";

export default function Tags({
	displayLayout,
	favoritesCount,
	selectedTags,
	tagCounts,
	tags,
	toggleTag,
}: {
	displayLayout: DisplayLayout;
	favoritesCount: number;
	selectedTags: ColorTag[];
	tagCounts: Record<ColorTag, number>;
	tags: ColorTag[];
	toggleTag: (tag: ColorTag) => void;
}) {
	const colorGroupTags = tags.filter((tag) => tag.startsWith("cg:"));
	const nonColorGroupTags = tags.filter((tag) => !tag.startsWith("cg:"));

	const showFavorites = selectedTags.includes("favorite");

	return (
		<div className="flex w-full flex-row flex-wrap gap-1">
			<div className="flex flex-wrap gap-1">
				<Toggle
					color="default"
					border="outline"
					disabled={favoritesCount === 0 && !showFavorites}
					pressed={showFavorites}
					onPressedChange={() => toggleTag("favorite")}
					role="favorites"
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
							key={`tag-${tag}`}
							color="default"
							border="outline"
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
				<div className="w-full sm:hidden" />
				<ColorTags
					className={cn(displayLayout === "live" ? "flex lg:hidden" : "")}
					selectedTags={selectedTags}
					tagCounts={tagCounts}
					tags={colorGroupTags}
					toggleTag={toggleTag}
				/>
			</div>
			<div className="hidden w-full flex-wrap gap-1 lg:flex lg:flex-nowrap">
				{displayLayout === "live" && (
					<ColorTags
						className="flex flex-1"
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
	toggleTag: (tag: ColorTag) => void;
}) {
	return (
		<>
			{Object.entries(colorGroupHexMap).map(([tag, tagColor], colIndex) => {
				const count = tagCounts[tag];
				const isDisabled = count === 0;
				return (
					<Toggle
						key={`tag-${tag}-${colIndex}`}
						disabled={isDisabled}
						color="default"
						border="outline"
						pressed={selectedTags.includes(tag)}
						onPressedChange={() => toggleTag(tag)}
						className={cn("hover:opacity-70", className)}
						style={{
							backgroundColor: tagColor,
						}}
					>
						<span
							style={{
								color: getContrastColor(tagColor),
							}}
						>
							{tag.replace("cg:", "")}
						</span>
						{count > 0 && (
							<span
								className={"opacity-70"}
								style={{
									color: getContrastColor(tagColor),
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
