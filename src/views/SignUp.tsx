import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import supabase from "../config/supabase"
import Checkbox from "expo-checkbox"
import { useLogin } from "../hooks/useLogin"
import { authNavigationRef } from "../libs/navigationUtilities"
import Spinner from "react-native-loading-spinner-overlay"
import { validateEmail } from "../libs/email"

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
			setBusy(false)
			return
		}

		if (!validateEmail(email)) {
			showToast("Please enter a valid email")
			setBusy(false)
			return
		}

		// check if user already exists
		const { data } = await supabase.from("users").select("*").eq("email", email.toLocaleLowerCase())
		if (data && data.length > 0) {
			showToast("User already exists. Please use forgot password or login.")
			setBusy
			return
		}

		const { error } = await supabase
			.from("users")
			.insert([{ email: email.toLocaleLowerCase(), password }])

		if (error) {
			console.error(error)
			showToast("Something went wrong")
			setBusy(false)
			return
		}

		setEmail("")
		setPassword("")
		const emailjsParams = {
			account: email,
		}
		try {
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
		} catch (error) {
			console.error(error)
			showToast("Something went wrong")
			setBusy(false)
			return
		}
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
			<Spinner visible={busy} />
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
			<Pressable
				style={{ alignItems: "center" }}
				onPress={() => authNavigationRef.navigate("Login")}
			>
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
