import { TextInput, StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native"
import React, { useState } from "react"
import { colors } from "../styles"
import showToast from "../libs/toast"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import supabase from "../config/supabase"

const SignUp = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const insets = useSafeAreaInsets()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

	const signUp = async () => {
		if (!email || !password) {
			showToast("Please enter an email and password")
			return
		}

		const { error } = await supabase
			.from("users")
			.insert([{ email: email.toLocaleLowerCase(), password }])

		if (error) {
			console.log(error)
			showToast("Something went wrong")
			return
		}

		setEmail("")
		setPassword("")
		showToast("Account created. You can now login.")
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
			</View>
			<TouchableOpacity
				onPress={() => signUp()}
				style={[styles.button, { opacity: !email || !password ? 0.5 : 1 }]}
				disabled={email.length === 0 || password.length === 0}
			>
				<Text style={styles.text}>Sign Up</Text>
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

export default SignUp
