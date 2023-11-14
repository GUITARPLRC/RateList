import { StyleSheet } from "react-native"
import ItemComponent from "./Item"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import useMyLists from "../hooks/useMyLists"

export default function ListItem({ item }: { item: Item }) {
  const { setSelectedListItem } = useMyLists()
  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

  const handleEdit = () => {
    setSelectedListItem(item)
    navigator.navigate("ItemEditor")
  }

  return <ItemComponent item={item} onEdit={handleEdit} />
}
