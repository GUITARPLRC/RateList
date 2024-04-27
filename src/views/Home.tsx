import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native"
import React, { useCallback } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import useMyLists from "../hooks/useMyLists"
import { useAuth } from "../context/auth"
import Spinner from "react-native-loading-spinner-overlay"
import { colors, themes } from "../styles"
import Search from "../components/Search"
import { navigationRef } from "../libs/navigationUtilities"

export default function Home() {
	const {
		myLists,
		getLists,
		loading: listLoading,
		setSelectedList,
		searchValue,
		setSearchValue,
	} = useMyLists()
	const { profile, loading: userLoading } = useAuth()

	useFocusEffect(
		useCallback(() => {
			getLists()
		}, [profile]),
	)

	const handleSelectListNavigate = (list: List) => {
		setSelectedList(list)
		navigationRef.navigate("List")
	}

	return (
		<View style={[styles.container]}>
			<Spinner visible={listLoading || userLoading} />
			<View style={[styles.margin]}>
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			</View>
			<ScrollView>
				{/* TODO: handle no lists - empty view */}
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
					// TODO: add create list button
					<Text style={styles.text}>Create A List!</Text>
				)}
			</ScrollView>
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
})
