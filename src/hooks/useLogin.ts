import { useState } from "react"
import supabase from "../config/supabase"
import showToast from "../libs/toast"
import { useAuth } from "../context/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useBadges } from "./useBadges"

export const useLogin = () => {
	const [loading, setLoading] = useState(false)
	const { getProfile } = useAuth()
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()
	const { fetchBadges } = useBadges()

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
				return false
			}

			if (!data || data.length === 0) {
				showToast("Email Password combination is incorrect. Please try again.")
				setLoading(false)
				return false
			}
			await AsyncStorage.setItem("email", email)
			await getProfile()
		} catch (error) {
			console.error(error)
			showToast("There was an error. Please try again.")
			return false
		}
		setLoading(false)
		return true
	}

	const signIn = async (email: string, password: string, remember: boolean) => {
		if (!email || !password) {
			showToast("Please enter an email and password")
			return
		}
		try {
			const data = {
				email: email.toLocaleLowerCase(),
				password,
			}
			if (remember) {
				await AsyncStorage.setItem("remember", JSON.stringify(data))
			}
			const success = await handleSignIn(data)
			if (success) {
				fetchBadges()
				navigator.navigate("Home")
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Try again")
			}
		}
	}

	return { loading, handleSignIn, signIn }
}
