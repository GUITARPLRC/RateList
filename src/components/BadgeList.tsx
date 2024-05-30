import React, { useLayoutEffect } from "react"
import { colors } from "../styles"
import { View, Text, StyleSheet } from "react-native"
import { useBadges } from "../hooks/useBadges"
import Badge from "./Badge"

const Badges = () => {
	const { fetchBadges } = useBadges()
	const [badges, setBadges] = React.useState<Badge[]>([])

	useLayoutEffect(() => {
		const fetch = async () => {
			const badges = await fetchBadges()
			if (badges) setBadges(badges)
		}
		fetch()
	}, [])

	if (!badges.length) return null

	return (
		<View>
			<Text style={[styles.text, styles.spacing]}>Achievements</Text>
			<View style={styles.badgeContainer}>
				{badges.map((badge, index) => (
					<Badge key={index} badgeType={badge.type} />
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	badgeContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
	},
	spacing: {
		marginTop: 20,
		marginBottom: 15,
	},
})

export default Badges
