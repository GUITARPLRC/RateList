import { Pressable, StyleSheet, Text, View, FlatList } from "react-native"
import React, { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import useMyLists from "../hooks/useMyLists"
import Spinner from "react-native-loading-spinner-overlay"
import { useListItems } from "../hooks/useListItems"
import ListItem from "../components/ListItem"
import { colors } from "../styles"
import Search from "../components/Search"

// TODO: rerender list when item delete

const List = () => {
	const { selectedList } = useMyLists()
	const {
		loading,
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

	const handleSort = () => {
		let newSortValue: SortValue = "Title"
		if (sortValue === "Title") {
			newSortValue = "Rating Up"
		} else if (sortValue === "Rating Up") {
			newSortValue = "Rating Down"
		}
		setSortValue(newSortValue)
	}

	return (
		<View style={[styles.container]}>
			<View style={[styles.titleContainer, styles.margin]}>
				<Spinner visible={loading} />
				<Text style={[styles.text, styles.categoryTitle]}>{selectedList?.title || ""}</Text>
			</View>
			<View style={[styles.margin]}>
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			</View>
			<View style={[styles.actionContainer, styles.margin]}>
				<Pressable style={{ width: 185 }} onPress={handleSort}>
					<Text style={styles.text}>Sort: {sortValue}</Text>
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
		padding: 20,
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
