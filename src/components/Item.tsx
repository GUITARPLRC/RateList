import { Pressable, Text, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { colors, themes } from "../styles"
import useMyLists from "../hooks/useMyLists"
import { useEffect, useState } from "react"

const Item = ({ item, onEdit }: { item: Item; onEdit: (arg: string) => void }) => {
	const [listTheme, setListTheme] = useState<{
		themeColors: string[]
	} | null>(null)
	const { selectedList } = useMyLists()

	// TODO: long press to confirm delete + haptic feedback

	useEffect(() => {
		setListTheme(themes[selectedList!.theme as keyof typeof themes])
	}, [selectedList?.theme])

	if (!item) return null

	const { title, subTitle, rating, id } = item
	return (
		<LinearGradient
			colors={listTheme?.themeColors ?? ["black", "black"]}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={[styles.linearGradient, { marginBottom: 20 }]}
		>
			<Pressable style={[styles.innerContainer]} onPress={() => onEdit(id)}>
				<View style={styles.flexContainer}>
					<Text style={[styles.text, styles.titleText]}>{title}</Text>
					<Text style={[styles.text, styles.subTitleText]}>{subTitle}</Text>
				</View>
				<View
					style={{
						marginRight: 10,
					}}
				>
					<Text style={[styles.text, styles.rating]}>{rating}</Text>
				</View>
			</Pressable>
		</LinearGradient>
	)
}

export default Item

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
	},
	innerContainer: {
		borderRadius: 15, // <-- Inner Border Radius
		flex: 1,
		margin: 5, // <-- Border Width
		backgroundColor: colors.darkBackground,
		justifyContent: "center",
		padding: 10,
		flexDirection: "row",
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 16,
	},
	titleText: {
		fontSize: 20,
		marginBottom: 5,
	},
	subTitleText: {
		fontSize: 16,
	},
	linearGradient: {
		height: 82,
		width: "100%",
		borderRadius: 20, // <-- Outer Border Radius
	},
	rating: {
		fontSize: 18,
	},
})
