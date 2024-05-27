import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Checkbox from "expo-checkbox"
import { useLogin } from "../hooks/useLogin"
import { authNavigationRef } from "../libs/navigationUtilities"
import Spinner from "react-native-loading-spinner-overlay"

const Login = () => {
	const { signIn, loading: loginLoading } = useLogin()
	const [emailInputValue, setEmailInputValue] = useState("test@chuckreynolds.dev")
	const [password, setPassword] = useState("123")
	const insets = useSafeAreaInsets()
	const [remember, setRemember] = useState(false)

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
			<Spinner visible={loginLoading} />
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
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Checkbox disabled={false} value={remember} onValueChange={setRemember} />
						<Text style={[styles.text, styles.smallText, { marginLeft: 5 }]}>Remember Me</Text>
					</View>
					<View>
						<Pressable onPress={() => authNavigationRef.navigate("ForgotPassword")}>
							<Text style={[styles.text, styles.smallText, styles.forgotPassword]}>
								Forgot Password
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
			<View>
				<TouchableOpacity
					onPress={() => signIn(emailInputValue, password, remember)}
					style={[styles.button, { opacity: !emailInputValue || !password ? 0.5 : 1 }]}
					disabled={emailInputValue.length === 0 || password.length === 0}
				>
					<Text style={styles.text}>Enter</Text>
				</TouchableOpacity>
				<Pressable
					style={{ alignItems: "center", marginTop: 30 }}
					onPress={() => authNavigationRef.navigate("SignUp")}
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
	smallText: {
		fontSize: 15,
		marginTop: 5,
	},
	forgotPassword: {
		textAlign: "right",
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
