import * as StoreReview from "expo-store-review"
import supabase from "../config/supabase"

export const userReview = async (profileId: string) => {
	try {
		await StoreReview.requestReview()
		const updates = {
			hasSubmittedReview: true,
		}
		let { error } = await supabase.from("users").update([updates]).eq("id", profileId)
		if (error instanceof Error) {
			console.error(error.message)
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message)
		}
	}
}
