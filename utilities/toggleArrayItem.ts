function toggleArrayItem<T>(
	item: T,
	setArray: React.Dispatch<React.SetStateAction<T[]>>,
): void;
function toggleArrayItem<T>(
	items: T[],
	setArray: React.Dispatch<React.SetStateAction<T[]>>,
): void;
function toggleArrayItem<T>(
	itemOrItems: T | T[],
	setArray: React.Dispatch<React.SetStateAction<T[]>>,
): void {
	setArray((prevArray) => {
		let newArray = [...prevArray];

		const itemsToToggle = Array.isArray(itemOrItems)
			? itemOrItems
			: [itemOrItems];

		itemsToToggle.forEach((item) => {
			if (newArray.includes(item)) {
				newArray = newArray.filter((i) => i !== item);
			} else {
				newArray.push(item);
			}
		});

		return newArray;
	});
}

export { toggleArrayItem };
