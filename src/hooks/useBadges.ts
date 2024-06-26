import { useEffect, useState } from "react"
import supabase from "../config/supabase"
import { useAuth } from "../context/auth"
import showToast from "../libs/toast"

export const useBadges = () => {
	const { profile } = useAuth()
	const [loading, setLoading] = useState(false)

	const fetchBadges = async () => {
		if (loading || !profile?.id) {
			return
		}
		try {
			setLoading(true)
			let { data, error } = await supabase
				.from("badges")
				.select("*")
				.eq("userId", profile.id)
				.select()
			if (error) {
				throw new Error(error.message)
			} else if (data) {
				setLoading(false)
				return data
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	const checkBadges = async (task: checkBadgesArgs) => {
		const data = await fetchBadges()
		let type: BadgeTypes | null = null
		switch (task) {
			case "addList":
				type = "blocks"
				break
			case "deleteList":
				type = "rocket"
				break
			case "updatedProfile":
				type = "trophy"
				break
			case "addRating":
				type = "crown"
				break
		}
		const badgeExists = data?.find((badge) => badge.type === type)
		if (type && !badgeExists) {
			createBadge(type)
		}
	}

	const createBadge = async (type: BadgeTypes) => {
		if (loading || !profile?.id) return
		try {
			setLoading(true)

			const newBadge = {
				type,
				userId: profile.id,
			}
			const { error } = await supabase.from("badges").insert(newBadge)
			if (error) {
				throw new Error(error.message)
			} else {
				showToast("Achievement Unlocked!")
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
			}
		} finally {
			setLoading(false)
		}
	}

	return {
		loading,
		setLoading,
		checkBadges,
		fetchBadges,
	}
}
