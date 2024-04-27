import ItemComponent from "./Item"
import useMyLists from "../hooks/useMyLists"
import { navigationRef } from "../libs/navigationUtilities"

export default function ListItem({ item }: { item: Item }) {
	const { setSelectedListItem } = useMyLists()

	const handleEdit = () => {
		setSelectedListItem(item)
		navigationRef.navigate("ItemEditor")
	}

	return <ItemComponent item={item} onEdit={handleEdit} />
}
