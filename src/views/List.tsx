import { Pressable, StyleSheet, Text, View, FlatList, Button } from "react-native"
import React, { useCallback, useLayoutEffect, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import useMyLists from "../hooks/useMyLists"
import Spinner from "react-native-loading-spinner-overlay"
import { useListItems } from "../hooks/useListItems"
import ListItem from "../components/ListItem"
import { colors } from "../styles"
import Search from "../components/Search"
import { Entypo } from "@expo/vector-icons"
import { navigationRef } from "../libs/navigationUtilities"
import { useActionSheet } from "@expo/react-native-action-sheet"
import Confirmation from "../components/Confirmation"
import showToast from "../libs/toast"

const List = () => {
	const [confirmationOpen, setConfirmationOpen] = useState(false)
	const navigation = useNavigation()
	const { selectedList, deleteList } = useMyLists()
	const {
		loading,
		listItems,
		fetchListItems,
		searchValue,
		setSearchValue,
		sortValue,
		setSortValue,
	} = useListItems()
	const { showActionSheetWithOptions } = useActionSheet()

	useFocusEffect(
		useCallback(() => {
			fetchListItems()
		}, []),
	)

	const { addListItem } = useListItems()

	const handleDelete = async () => {
		setConfirmationOpen(false)
		await deleteList()
		showToast("List deleted")
		navigationRef.navigate("Home")
	}

	const handleDotPress = () => {
		const options = ["Edit List", "Delete List", "Cancel"]
		const destructiveButtonIndex = 1
		const cancelButtonIndex = 2

		showActionSheetWithOptions(
			{
				options,
				destructiveButtonIndex,
				cancelButtonIndex,
			},
			(selectionIndex: any) => {
				switch (selectionIndex) {
					case 0:
						// Edit
						navigationRef.navigate("ListEditor")
						break
					case 1:
						setConfirmationOpen(true)
						break
					default:
						break
				}
			},
		)
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={styles.listRightHeader}>
					<Pressable onPress={addListItem} style={{ marginRight: 20 }}>
						<Entypo name="plus" size={30} color="#fff" />
					</Pressable>
					<Pressable style={{ marginRight: 20 }} onPress={handleDotPress}>
						<Entypo name="dots-three-vertical" size={20} color="#fff" />
					</Pressable>
				</View>
			),
		})
	}, [])

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
			{listItems.length > 0 ? (
				<>
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
				</>
			) : (
				<View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
					<Text style={[styles.text, { fontSize: 20 }]}>
						No items in this list use the + button above or the button below
					</Text>
					<Button title="Add Item" onPress={addListItem} />
				</View>
			)}
			<Confirmation
				isOpen={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
				confirmText="Are you sure you want to delete this list?"
				onConfirm={handleDelete}
			/>
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
	listRightHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
})
