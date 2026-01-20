import { Dispatch, SetStateAction } from "react";

import { DisplayItem } from "@/components/Swatch";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DisplayLayout } from "@/data/colors";
import { ColorFormat } from "@/utilities/formatColor";

export default function Tools({
	colorFormat,
	displayItems,
	displayLayout,
	favorites,
	handleExport,
	setColorFormat,
	setDisplayItems,
	setDisplayLayout,
	setFavorites,
	setShowFavorites,
}: {
	colorFormat: ColorFormat;
	displayItems: DisplayItem[];
	displayLayout: DisplayLayout;
	favorites: Set<string>;
	handleExport: () => void;
	setColorFormat: Dispatch<SetStateAction<ColorFormat>>;
	setDisplayItems: Dispatch<SetStateAction<DisplayItem[]>>;
	setDisplayLayout: Dispatch<SetStateAction<DisplayLayout>>;
	setFavorites: Dispatch<SetStateAction<Set<string>>>;
	setShowFavorites: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className="flex w-full flex-wrap gap-1">
			{favorites.size > 0 && (
				<Button
					onClick={() => {
						setFavorites(new Set());
						setShowFavorites(false);
					}}
					variant={"outline"}
				>
					clear favorites
				</Button>
			)}
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
				type="multiple"
				value={displayItems}
				onValueChange={(newDisplayItems: DisplayItem[]) =>
					newDisplayItems && setDisplayItems(newDisplayItems)
				}
			>
				<ToggleGroupItem value="color-names" className="hidden lg:flex">
					names
				</ToggleGroupItem>
			</ToggleGroup>
			<Button onClick={handleExport} variant={"outline"}>
				export
			</Button>
		</div>
	);
}
