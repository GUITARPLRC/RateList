import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import supabase from "../config/supabase"

const TokenEntry = () => {
	const [token, setToken] = useState("")
	const insets = useSafeAreaInsets()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

	const checkToken = async () => {
		if (!token) {
			showToast("Please enter a token.")
			return
		}

		try {
			// check if user token is valid
			const { data, error } = await supabase.from("users").select("*").eq("token", token)

			if (error) {
				console.log(error)
				showToast("Something went wrong")
				return
			}

			if (!data || data.length === 0) {
				showToast("Invalid token")
				return
			}

			navigator.navigate("ResetPassword", { data: data[0] })
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Try again")
			}
		}
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
			<Text style={[styles.text, styles.titleText]}>Sign Up</Text>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={setToken}
					value={token}
					placeholder="Reset Token"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
			</View>
			<TouchableOpacity
				onPress={() => checkToken()}
				style={[styles.button, { opacity: !token ? 0.5 : 1 }]}
				disabled={token.length === 0}
			>
				<Text style={styles.text}>Reset Password</Text>
			</TouchableOpacity>
			<Pressable style={{ alignItems: "center" }} onPress={() => navigator.navigate("Login")}>
				<Text style={styles.text}>Back To Login</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-evenly",
		backgroundColor: colors.darkBackground,
		paddingHorizontal: 20,
	},
	button: {
		marginVertical: 15,
		alignItems: "center",
		backgroundColor: colors.green,
		padding: 12,
		borderRadius: 4,
		width: 300,
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
		width: 300,
	},
	titleText: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
	},
})

export default TokenEntry
