import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { DisplayItem } from "@/components/Swatch";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ColorTag, DisplayLayout } from "@/data/colors";
import { ColorFormat } from "@/utilities/formatColor";

export default function Tools({
	colorFormat,
	displayItems,
	displayLayout,
	favorites,
	handleExport,
	selectedTags,
	setColorFormat,
	setDisplayItems,
	setDisplayLayout,
	setFavorites,
	setSelectedTags,
	setShowFavorites,
	showFavorites,
}: {
	colorFormat: ColorFormat;
	displayItems: DisplayItem[];
	displayLayout: DisplayLayout;
	favorites: Set<string>;
	handleExport: () => void;
	selectedTags: ColorTag[];
	setColorFormat: Dispatch<SetStateAction<ColorFormat>>;
	setDisplayItems: Dispatch<SetStateAction<DisplayItem[]>>;
	setDisplayLayout: Dispatch<SetStateAction<DisplayLayout>>;
	setFavorites: Dispatch<SetStateAction<Set<string>>>;
	setSelectedTags: Dispatch<SetStateAction<ColorTag[]>>;
	setShowFavorites: Dispatch<SetStateAction<boolean>>;
	showFavorites: boolean;
}) {
	return (
		<div className="flex w-full flex-wrap gap-1">
			<ToggleGroup
				type="single"
				value={displayLayout}
				onValueChange={(newDisplayLayout: DisplayLayout) =>
					newDisplayLayout && setDisplayLayout(newDisplayLayout)
				}
			>
				<ToggleGroupItem value="live">live</ToggleGroupItem>
				<ToggleGroupItem value="push">push</ToggleGroupItem>
			</ToggleGroup>
			<ToggleGroup
				type="single"
				value={colorFormat}
				onValueChange={(newColorFormat: ColorFormat) =>
					newColorFormat && setColorFormat(newColorFormat)
				}
			>
				<ToggleGroupItem value="hex">hex</ToggleGroupItem>
				<ToggleGroupItem value="rgb">rgb</ToggleGroupItem>
				<ToggleGroupItem value="hsl">hsl</ToggleGroupItem>
			</ToggleGroup>
			<ToggleGroup
				className="hidden lg:flex"
				type="multiple"
				value={displayItems}
				onValueChange={(newDisplayItems: DisplayItem[]) =>
					newDisplayItems && setDisplayItems(newDisplayItems)
				}
			>
				<ToggleGroupItem value="color-names">names</ToggleGroupItem>
			</ToggleGroup>
			<Button onClick={handleExport} variant={"outline"}>
				export
			</Button>
			{favorites.size > 0 && (
				<Button
					onClick={() => {
						setFavorites(new Set());
						setShowFavorites(false);
					}}
					variant={"outline"}
				>
					<X className="size-3" />
					<span>clear favorites</span>
				</Button>
			)}
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
		</div>
	);
}
