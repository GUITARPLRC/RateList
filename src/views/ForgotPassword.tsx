import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import generateSixToken from "../libs/generateSixToken"
import supabase from "../config/supabase"
import { navigationRef } from "../libs/navigationUtilities"

const ForgotPassword = () => {
	const [email, setEmail] = useState("")
	const insets = useSafeAreaInsets()

	const sendForgot = async () => {
		if (!email) {
			showToast("Please enter an email")
			return
		}

		try {
			// check if email exists in db
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("email", email.toLocaleLowerCase())

			if (error) {
				console.error(error)
				showToast("Something went wrong")
				return
			}

			if (!data || data.length === 0) {
				showToast(
					"If there is an account associated with this email, you will receive a reset email.",
				)
				return
			}

			const newToken = generateSixToken()
			// post code to profile
			const { error: updateError } = await supabase
				.from("users")
				.update({ token: newToken, lastResetAttempt: new Date() })
				.eq("email", email.toLocaleLowerCase())

			if (updateError) {
				console.error(updateError)
				showToast("Something went wrong")
				return
			}
			// send email using emailjs with token
			const emailjsParams = {
				to_email: email,
				token: newToken,
			}
			await fetch("https://api.emailjs.com/api/v1.0/email/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					service_id: "service_xtkchaz",
					template_id: "template_41d1ybs",
					user_id: "w0on1dwNj7pYOLeCd",
					template_params: emailjsParams,
				}),
			})
			showToast("Check your email for a code.")

			navigationRef.navigate("TokenEntry")
		} catch (error) {
			console.error(error)
			showToast("Something went wrong")
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
			<Text style={[styles.text, styles.titleText]}>Forgot Password</Text>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={setEmail}
					value={email}
					placeholder="Email"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
				<TouchableOpacity
					onPress={() => sendForgot()}
					style={[styles.button, { opacity: !email ? 0.5 : 1 }]}
					disabled={email.length === 0}
				>
					<Text style={styles.text}>Send Reset Email</Text>
				</TouchableOpacity>
			</View>
			<Pressable style={{ alignItems: "center" }} onPress={() => navigationRef.navigate("Login")}>
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

export default ForgotPassword
