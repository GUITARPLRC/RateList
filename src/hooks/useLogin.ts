import { useState } from "react"
import supabase from "../config/supabase"
import showToast from "../libs/toast"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../context/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StackNavigationProp } from "@react-navigation/stack"

export const useLogin = () => {
	const [loading, setLoading] = useState(false)
	const { getProfile } = useAuth()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

	const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
		setLoading(true)

		try {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.match({ email, password })
				.select()

			if (error) {
				console.error(error)
				setLoading(false)
				showToast("There was an error. Please try again.")
				return
			}

			if (!data || data.length === 0) {
				showToast("Email Password combination is incorrect. Please try again.")
				setLoading(false)
				return
			}
			await AsyncStorage.setItem("email", email)
			getProfile()
			navigator.navigate("Home")
		} catch (error) {
			console.error(error)
			showToast("There was an error. Please try again.")
		}
		setLoading(false)
	}

	return { loading, handleSignIn }
}