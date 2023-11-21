import { ScrollView, Pressable, Text, StyleSheet, View, Image } from "react-native"
import React, { useCallback } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useMyLists from "../hooks/useMyLists"
import { useAuth } from "../context/auth"
import { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { avatars } from "./Profile"
import Spinner from "react-native-loading-spinner-overlay"
import { colors, themes } from "../styles"
import Search from "../components/Search"

const sortByReferences = [{ type: "Title" }]

export default function Home() {
	const {
		myLists,
		createList,
		getLists,
		loading: listLoading,
		setSelectedList,
		searchValue,
		setSearchValue,
	} = useMyLists()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()
	const { profile, loading: userLoading } = useAuth()

	useFocusEffect(
		useCallback(() => {
			getLists()
		}, [profile]),
	)

	const handleSelectListNavigate = (list: List) => {
		setSelectedList(list)
		navigator.navigate("List")
	}

	const insets = useSafeAreaInsets()

	const handleNavigateToProfile = () => {
		navigator.navigate("Profile")
	}

	const handleCreateFlow = async () => {
		const newList = await createList()
		if (!newList) return
		setSelectedList(newList)
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
			<Spinner visible={listLoading || userLoading} />
			<View style={[styles.title, styles.margin]}>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={1} style={[styles.text]}>
						{profile?.username ? profile.username : ""}
					</Text>
				</View>
				<Pressable style={{ marginLeft: 10 }} onPress={handleNavigateToProfile}>
					{profile?.avatar ? (
						<Image
							source={avatars[profile.avatar as keyof typeof avatars]}
							style={{ width: 40, height: 40 }}
						/>
					) : (
						<Ionicons name="person-circle-outline" size={24} color="white" />
					)}
				</Pressable>
			</View>
			<View>
				<Text style={[styles.text, styles.categoryTitle, styles.margin]}>My Lists</Text>
			</View>
			<View style={[styles.margin]}>
				<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			</View>
			<View style={[styles.actionContainer, styles.margin]}>
				<Pressable onPress={handleCreateFlow}>
					<Text style={styles.text}>Add</Text>
				</Pressable>
			</View>
			<ScrollView>
				{/* TODO: handle no lists - empty view */}
				{myLists &&
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
					))}
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
		paddingHorizontal: 20,
		paddingTop: 70,
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
