import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import supabase from "../config/supabase"
import Checkbox from "expo-checkbox"
import { useLogin } from "../hooks/useLogin"
import { navigationRef } from "../libs/navigationUtilities"

const SignUp = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const insets = useSafeAreaInsets()
	const [remember, setRemember] = useState(false)
	const [busy, setBusy] = useState(false)
	const { signIn } = useLogin()

	const signUp = async () => {
		if (busy) return
		setBusy(true)

		if (!email || !password) {
			showToast("Please enter an email and password")
			return
		}

		// check if email is valid
		const emailRegex = /\S+@\S+\.\S+/
		if (!emailRegex.test(email)) {
			showToast("Please enter a valid email")
			return
		}

		// check if user already exists
		const { data } = await supabase.from("users").select("*").eq("email", email.toLocaleLowerCase())

		if (data && data.length > 0) {
			showToast("User already exists. Please use forgot password or login.")
			return
		}
		return

		const { error } = await supabase
			.from("users")
			.insert([{ email: email.toLocaleLowerCase(), password }])

		if (error) {
			console.error(error)
			showToast("Something went wrong")
			return
		}

		setEmail("")
		setPassword("")
		const emailjsParams = {
			account: email,
		}
		fetch("https://api.emailjs.com/api/v1.0/email/send", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				service_id: "service_xtkchaz",
				template_id: "template_2ewriek",
				user_id: "w0on1dwNj7pYOLeCd",
				template_params: emailjsParams,
			}),
		})
		setBusy(false)
		showToast("A New User 😮 Welcome!")
		signIn(email, password, remember)
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
					onChangeText={setEmail}
					value={email}
					placeholder="Email"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
				<TextInput
					style={styles.input}
					onChangeText={setPassword}
					value={password}
					placeholder="Password"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
					secureTextEntry={true}
				/>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Checkbox disabled={false} value={remember} onValueChange={setRemember} />
						<Text style={[styles.text, { marginLeft: 5 }]}>Remember Me</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				onPress={() => signUp()}
				style={[styles.button, { opacity: !email || !password ? 0.5 : 1 }]}
				disabled={email.length === 0 || password.length === 0}
			>
				<Text style={styles.text}>Sign Up</Text>
			</TouchableOpacity>
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

export default SignUp
