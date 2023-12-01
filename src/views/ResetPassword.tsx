import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import supabase from "../config/supabase"

const ResetPassword = () => {
	const [newPass, setNewPass] = useState("")
	const [confirmPass, setConfirmPass] = useState("")
	const insets = useSafeAreaInsets()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()
	const { params } = useRoute() as { params: { data: { email: string } } }

	const sendReset = async () => {
		if (newPass !== confirmPass) {
			showToast("Passwords do not match")
			return
		}

		try {
			// update password in db
			const { error } = await supabase
				.from("users")
				.update({ password: newPass })
				.eq("email", params?.data?.email.toLocaleLowerCase())

			if (error) {
				console.log(error)
				showToast("Something went wrong")
				return
			}

			showToast("Password updated")

			navigator.navigate("Login")
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
			<Text style={[styles.text, styles.titleText]}>Reset Password</Text>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={setNewPass}
					value={newPass}
					placeholder="Password"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
					secureTextEntry={true}
				/>
				<TextInput
					style={styles.input}
					onChangeText={setConfirmPass}
					value={confirmPass}
					placeholder="Confirm Password"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
					secureTextEntry={true}
				/>
				<TouchableOpacity
					onPress={() => sendReset()}
					style={[styles.button, { opacity: !newPass || !confirmPass ? 0.5 : 1 }]}
					disabled={newPass.length === 0 || confirmPass.length === 0}
				>
					<Text style={styles.text}>Reset</Text>
				</TouchableOpacity>
			</View>
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

export default ResetPassword
