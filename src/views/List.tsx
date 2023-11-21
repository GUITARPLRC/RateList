import { Pressable, StyleSheet, Text, View, FlatList } from "react-native"
import React, { useCallback } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useMyLists from "../hooks/useMyLists"
import Pencil from "../icons/Pencil"
import { StackNavigationProp } from "@react-navigation/stack"
import Spinner from "react-native-loading-spinner-overlay"
import { useListItems } from "../hooks/useListItems"
import ListItem from "../components/ListItem"
import { colors } from "../styles"
import Search from "../components/Search"

// TODO: rerender list when item delete

const List = () => {
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()
	const insets = useSafeAreaInsets()
	const { selectedList, setSelectedListItem } = useMyLists()
	const {
		loading,
		addListItem,
		listItems,
		fetchListItems,
		searchValue,
		setSearchValue,
		sortValue,
		setSortValue,
	} = useListItems()

	useFocusEffect(
		useCallback(() => {
			fetchListItems()
		}, []),
	)

	const handleAdd = async () => {
		const newItem = {
			title: "",
			description: "",
		}
		const newListItem = await addListItem(newItem)
		if (!newListItem) return
		setSelectedListItem(newListItem)
		navigator.navigate("ItemEditor")
	}

	const handleSort = () => {
		let newSortValue: SortValue = "Title"
		if (sortValue === "Title") {
			newSortValue = "Rating Up"
		} else if (sortValue === "Rating Up") {
			newSortValue = "Rating Down"
		}
		setSortValue(newSortValue)
	}

	const handleEdit = () => {
		navigator.navigate("ListEditor")
	}

	return (
		<View
			style={[
				styles.container,
				{
					paddingTop: insets.top,
					paddingLeft: insets.left === 0 ? 20 : insets.left,
					paddingRight: insets.right === 0 ? 20 : insets.right,
					paddingBottom: insets.bottom,
				},
			]}
		>
			<View style={[styles.titleContainer, styles.margin]}>
				<Spinner visible={loading} />
				<Text style={[styles.text, styles.categoryTitle]}>{selectedList?.title || ""}</Text>
				<Pressable onPress={handleEdit}>
					<Pencil size={20} color={colors.white} />
				</Pressable>
			</View>
			<View style={[styles.margin]}>
				<Pressable onPress={() => navigator.navigate("Home")}>
					<Text style={[styles.text]}>Back to My Lists</Text>
				</Pressable>
			</View>
			<View style={[styles.margin]}>
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			</View>
			<View style={[styles.actionContainer, styles.margin]}>
				<Pressable style={{ width: 185 }} onPress={handleSort}>
					<Text style={styles.text}>Sort: {sortValue}</Text>
				</Pressable>
				<Pressable onPress={handleAdd}>
					<Text style={styles.text}>Add</Text>
				</Pressable>
			</View>
			<View style={{ flex: 1, flexGrow: 1 }}>
				<FlatList
					data={listItems}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <ListItem item={item} key={item.id} />}
				/>
			</View>
		</View>
	)
}

export default List

const styles = StyleSheet.create({
	margin: {
		marginBottom: 20,
	},
	container: {
		flex: 1,
		backgroundColor: colors.darkBackground,
		paddingHorizontal: 20,
		paddingTop: 70,
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		maxWidth: "100%",
	},
	categoryTitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	actionContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
})
