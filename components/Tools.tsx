import { AlertTriangle, X } from "lucide-react";

import { ConfirmButton } from "@/components/ConfirmButton";
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
		<div className="flex w-full flex-col flex-wrap gap-1 sm:flex-row">
			<div className="flex flex-wrap gap-1">
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
				<Button
					onClick={handleExport}
					color="default"
					border="outline"
					size="sm"
				>
					export
				</Button>
			</div>
			{(favorites.size || selectedTags.length > 0 || showFavorites) && (
				<div className="flex flex-wrap gap-1">
					{favorites.size > 0 && (
						<ConfirmButton
							onConfirm={() => setFavorites([])}
							initialText="clear favorites"
							confirmText="are you sure?"
							initialIcon={<X className="size-3" />}
							confirmIcon={<AlertTriangle className="size-3" />}
						/>
					)}

					{(selectedTags.length > 0 || showFavorites) && (
						<Button
							onClick={() => {
								setSelectedTags([]);
							}}
							color="default"
							border="outline"
							size="sm"
							disabled={!(selectedTags.length > 0 || showFavorites)}
							role="clear tags"
						>
							<X className="size-3" />
							<span>clear tag{selectedTags.length > 1 && "s"}</span>
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
