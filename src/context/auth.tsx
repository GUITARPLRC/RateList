import React, { useState, useContext, createContext, PropsWithChildren } from "react"
import supabase from "../config/supabase"
import showToast from "../libs/toast"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Props {
	profile: Profile | null
	getProfile: () => Promise<void>
	loading: boolean
	clearProfile: () => void
}

export const AuthContext = createContext<Props>({
	profile: null,
	getProfile: () => Promise.resolve(),
	loading: false,
	clearProfile: () => {},
})

export function useAuth() {
	return useContext(AuthContext)
}

export default function AuthProvider({ children }: PropsWithChildren) {
	const [profile, setProfile] = useState<Profile | null>(null)
	const [loading, setLoading] = useState(false)

	const clearProfile = () => {
		setProfile(null)
	}

	const getProfile = async () => {
		if (loading) return
		setLoading(true)
		try {
			// get email, deviceId from async storage
			const email = await AsyncStorage.getItem("email")

			if (!email) {
				setLoading(false)
				return
			}

			const { data, error, status } = await supabase
				.from("users")
				.select("*")
				.match({ email: email })
				.single()

			if (error && status !== 406) {
				throw new Error(error.message)
			}

			if (data) {
				setProfile(data)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("There was an error getting your profile")
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				profile,
				getProfile,
				loading,
				clearProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
