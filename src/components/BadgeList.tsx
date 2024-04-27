import React from "react"
import { colors } from "../styles"
import { View, Text, StyleSheet } from "react-native"
import { useBadges } from "../hooks/useBadges"
import Badge from "./Badge"

const Badges = () => {
	const { badges } = useBadges()

	if (!badges.length) return null

	return (
		<View>
			<Text style={[styles.text, { marginTop: 20, marginBottom: 15 }]}>Achievements</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
				{badges.map((badge, index) => (
					<Badge key={index} badgeType={badge.type} />
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
	},
})

export default Badges
