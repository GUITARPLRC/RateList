import { Pressable, Text, StyleSheet, View, Button } from "react-native"
import React, { useCallback } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import useMyLists from "../hooks/useMyLists"
import { useAuth } from "../context/auth"
import Spinner from "react-native-loading-spinner-overlay"
import { colors, themes } from "../styles"
import Search from "../components/Search"
import { navigationRef } from "../libs/navigationUtilities"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { userReview } from "../libs/appStore"
import { useListItems } from "../hooks/useListItems"

export default function Home() {
	const {
		myLists,
		getLists,
		loading: listLoading,
		setSelectedList,
		searchValue,
		setSearchValue,
		createList,
	} = useMyLists()
	const { profile, loading: userLoading } = useAuth()
	const { listItems } = useListItems()

	useFocusEffect(
		useCallback(() => {
			getLists()
		}, [profile]),
	)

	const handleSelectListNavigate = (list: List) => {
		setSelectedList(list)
		navigationRef.navigate("List")
		// ask for store review if user has 3 or more lists
		if (
			(myLists.length >= 2 || listItems.length === 3) &&
			profile &&
			!profile?.hasSubmittedReview
		) {
			userReview(profile.id)
		}
	}
	const isLoading = listLoading || userLoading
	return (
		<View style={[styles.container]}>
			<Spinner visible={isLoading} />
			<View style={[styles.margin]}>
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			</View>
			<KeyboardAwareScrollView>
				{myLists.length ? (
					myLists.map((list) => (
						<LinearGradient
							colors={themes[list.theme as keyof typeof themes].themeColors}
							start={{ x: 1, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={[styles.linearGradient, styles.margin]}
							key={list.id}
						>
							<Pressable
								style={styles.innerContainer}
								onPress={() => handleSelectListNavigate(list)}
							>
								<Text style={[styles.text, styles.categoryTitle]}>{list.title}</Text>
							</Pressable>
						</LinearGradient>
					))
				) : (
					<View style={styles.noListContainer}>
						{!isLoading ? (
							<>
								<Text style={[styles.text, styles.noListText]}>
									Get started creating a List with the + button at the top or pressing the button
									below
								</Text>
								<Button title="Add List" onPress={createList} />
							</>
						) : null}
					</View>
				)}
			</KeyboardAwareScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	margin: {
		marginBottom: 20,
	},
	container: {
		flex: 1,
		backgroundColor: colors.darkBackground,
		padding: 20,
	},
	title: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	linearGradient: {
		height: 82,
		width: "100%",
		borderRadius: 20, // <-- Outer Border Radius
	},
	innerContainer: {
		borderRadius: 15, // <-- Inner Border Radius
		flex: 1,
		margin: 5, // <-- Border Width
		backgroundColor: colors.darkBackground,
		justifyContent: "center",
		padding: 10,
	},
	categoryTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
	},
	searchText: {
		fontSize: 16,
	},
	actionContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		width: "100%",
		padding: 10,
	},
	noListContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		minHeight: "100%",
	},
	noListText: {
		fontSize: 20,
	},
})
