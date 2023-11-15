import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import Spinner from "react-native-loading-spinner-overlay"
import { useLogin } from "../hooks/useLogin"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

const Login = () => {
	const [emailInputValue, setEmailInputValue] = useState("")
	const [password, setPassword] = useState("")
	const { handleSignIn, loading } = useLogin()
	const insets = useSafeAreaInsets()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

	const signIn = async () => {
		if (!emailInputValue || !password) {
			showToast("Please enter an email and password")
			return
		}
		try {
			const data = {
				email: emailInputValue,
				password,
			}
			setEmailInputValue("")
			setPassword("")
			await handleSignIn(data)
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
			<Spinner visible={loading} />
			<Text style={[styles.text, styles.titleText]}>RateList</Text>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={setEmailInputValue}
					value={emailInputValue}
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
					secureTextEntry={true}
					keyboardType="default"
				/>
				<Pressable onPress={() => navigator.navigate("ForgotPassword")}>
					<Text style={[styles.text, styles.forgotText]}>Forgot Password</Text>
				</Pressable>
			</View>
			<View>
				<TouchableOpacity
					onPress={() => signIn()}
					style={[styles.button, { opacity: !emailInputValue || !password ? 0.5 : 1 }]}
					disabled={emailInputValue.length === 0 || password.length === 0}
				>
					<Text style={styles.text}>Enter</Text>
				</TouchableOpacity>
				<Pressable
					style={{ alignItems: "center", marginTop: 30 }}
					onPress={() => navigator.navigate("SignUp")}
				>
					<Text style={styles.text}>Sign Up</Text>
				</Pressable>
			</View>
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
	forgotText: {
		fontSize: 15,
		textAlign: "right",
		marginTop: 5,
	},
	titleText: {
		fontSize: 50,
		fontWeight: "bold",
		textAlign: "center",
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
	},
})

export default Login
