import React, { useState } from "react"
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Image,
	Dimensions,
} from "react-native"
import supabase from "../config/supabase"
import { useAuth } from "../context/auth"
import Spinner from "react-native-loading-spinner-overlay"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { colors } from "../styles"
import Badges from "../components/BadgeList"
import { useBadges } from "../hooks/useBadges"
import Confirmation from "../components/Confirmation"
import showToast from "../libs/toast"
import AsyncStorage from "@react-native-async-storage/async-storage"
import useMyLists from "../hooks/useMyLists"

export const avatars = {
	bear: require("../../assets/avatars/bear.png"),
	bee: require("../../assets/avatars/bee.png"),
	bird: require("../../assets/avatars/bird.png"),
	bull: require("../../assets/avatars/bull.png"),
	butterfly: require("../../assets/avatars/butterfly.png"),
	cow: require("../../assets/avatars/cow.png"),
	deer: require("../../assets/avatars/deer.png"),
	elephant: require("../../assets/avatars/elephant.png"),
	falcon: require("../../assets/avatars/falcon.png"),
	fish: require("../../assets/avatars/fish.png"),
	fox: require("../../assets/avatars/fox.png"),
	frog: require("../../assets/avatars/frog.png"),
	giraffe: require("../../assets/avatars/giraffe.png"),
	gorilla: require("../../assets/avatars/gorilla.png"),
	jellyfish: require("../../assets/avatars/jellyfish.png"),
	ladybug: require("../../assets/avatars/ladybug.png"),
	lamb: require("../../assets/avatars/lamb.png"),
	lion: require("../../assets/avatars/lion.png"),
	lizard: require("../../assets/avatars/lizard.png"),
	orangutan: require("../../assets/avatars/orangutan.png"),
	owl: require("../../assets/avatars/owl.png"),
	panda: require("../../assets/avatars/panda.png"),
	penguin: require("../../assets/avatars/penguin.png"),
	pig: require("../../assets/avatars/pig.png"),
	rabbit: require("../../assets/avatars/rabbit.png"),
	salamander: require("../../assets/avatars/salamander.png"),
	spider: require("../../assets/avatars/spider.png"),
	stork: require("../../assets/avatars/stork.png"),
	turtle: require("../../assets/avatars/turtle.png"),
	whale: require("../../assets/avatars/whale.png"),
	wolf: require("../../assets/avatars/wolf.png"),
	zebra: require("../../assets/avatars/zebra.png"),
}

const avatarThemes = ["farm", "safari", "water", "forest", "insects", "birds"]

const avatarThemeImages = {
	farm: ["bull", "cow", "lamb", "pig", "rabbit"],
	safari: ["elephant", "giraffe", "gorilla", "lion", "wolf", "zebra"],
	water: ["fish", "jellyfish", "penguin", "turtle", "whale"],
	forest: [
		"bear",
		"deer",
		"fox",
		"frog",
		"owl",
		"wolf",
		"salamander",
		"lizard",
		"orangutan",
		"panda",
	],
	insects: ["bee", "butterfly", "ladybug", "spider"],
	birds: ["bird", "falcon", "penguin", "stork"],
}

const currentThemes = [avatarThemes[2], avatarThemes[0]]

const getThemeAvatars = (theme: string) => {
	return avatarThemeImages[theme as keyof typeof avatarThemeImages]
}

const Profile = () => {
	const [loading, setLoading] = useState(false)
	const [userAvatar, setUserAvatar] = useState("")
	const { profile, getProfile, clearProfile } = useAuth()
	const [username, setUsername] = useState(profile?.username || "")
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()
	const { checkBadges, loading: badgesLoading } = useBadges()
	const [confirmOpen, setConfirmOpen] = useState(false)
	const { clearListData } = useMyLists()

	const signOut = async () => {
		// clear data from context
		clearListData()
		// clear profile from context
		clearProfile()
		// remove email from async storage/ timeout perceive working / add call to stack trick
		setTimeout(() => AsyncStorage.removeItem("email"), 1000)
		// navigate to login
		navigator.navigate("Login")
	}

	const updateProfile = async () => {
		if (!loading && profile) {
			try {
				setLoading(true)

				const updates = {
					username: username ? username : profile?.username,
					avatar: userAvatar ? userAvatar : profile?.avatar,
				}
				let { error } = await supabase.from("users").update([updates]).eq("email", profile.email)
				if (error) {
					if (error instanceof Error) {
						throw new Error(error.message)
					}
				}
			} catch (error) {
				if (error instanceof Error) {
					console.error(error.message)
					showToast("Error updating profile")
				}
			} finally {
				console.log("maybe")
				if (username && userAvatar) {
					checkBadges("updatedProfile")
				}
				setLoading(false)
				getProfile()
				setUserAvatar("")
			}
		}
	}

	const screenWidth = Dimensions.get("window").width

	return (
		<View style={styles.container}>
			<Spinner visible={loading || badgesLoading} />
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<TouchableOpacity disabled={loading} onPress={() => navigator.goBack()}>
					<Text style={styles.text}>Back to Lists</Text>
				</TouchableOpacity>
				<TouchableOpacity disabled={loading} onPress={() => setConfirmOpen(true)}>
					<Text style={styles.text}>Sign Out</Text>
				</TouchableOpacity>
			</View>
			<View style={{ marginBottom: 20 }}>
				<Text style={[styles.text, { marginBottom: 10 }]}>Display Name:</Text>
				<TextInput
					style={styles.input}
					onChangeText={setUsername}
					value={username}
					placeholder="Display Name"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
			</View>
			<Text style={styles.text}>Choose an avatar:</Text>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 10,
					marginVertical: 15,
				}}
			>
				{currentThemes
					.reduce((acc, theme) => {
						return acc.concat(getThemeAvatars(theme))
					}, [] as string[])
					.sort()
					.map((avatar) => {
						const avatarBorderStyle =
							(userAvatar ? userAvatar : profile?.avatar) === avatar
								? {
										borderColor: colors.green,
										borderWidth: 2,
										borderRadius: screenWidth,
										padding: 1,
								  }
								: { margin: 3 }
						return (
							<TouchableOpacity
								key={avatar}
								onPress={() => setUserAvatar(avatar)}
								style={avatarBorderStyle}
							>
								<Image
									source={avatars[avatar as keyof typeof avatars]}
									style={{ width: screenWidth / 7, height: screenWidth / 7 }}
								/>
							</TouchableOpacity>
						)
					})}
			</View>
			<TouchableOpacity
				disabled={loading || username === profile?.username || userAvatar === profile?.avatar}
				onPress={() => updateProfile()}
				style={[
					styles.button,
					{
						opacity:
							loading || username === profile?.username || userAvatar === profile?.avatar ? 0.5 : 1,
					},
				]}
			>
				<Text style={styles.text}>Update</Text>
			</TouchableOpacity>
			<Badges />
			<Confirmation
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={signOut}
				confirmText="Are you sure you want to sign out?"
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.darkBackground,
		paddingHorizontal: 20,
		paddingTop: 70,
	},
	button: {
		marginVertical: 15,
		alignItems: "center",
		backgroundColor: colors.green,
		padding: 12,
		borderRadius: 4,
	},
	input: {
		marginVertical: 4,
		height: 50,
		borderWidth: 1,
		borderColor: colors.green,
		borderRadius: 4,
		fontFamily: "Gill Sans",
		fontSize: 20,
		padding: 10,
		color: colors.white,
		backgroundColor: colors.grey,
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
	},
})

export default Profile
