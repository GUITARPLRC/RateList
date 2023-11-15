import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Text,
	Pressable,
	ScrollView,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import useMyLists from "../hooks/useMyLists"
import { colors } from "../styles"
import { useListItems } from "../hooks/useListItems"
import Confirmation from "../components/Confirmation"
import showToast from "../libs/toast"

export default function ItemEditor() {
	const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

	const { selectedListItem } = useMyLists()
	const { updateListItem, deleteListItem } = useListItems()
	const [title, setTitle] = useState(selectedListItem!.title)
	const [subTitle, setSubTitle] = useState(selectedListItem!.subTitle)
	const [description, setDescription] = useState(selectedListItem!.description)
	const [rating, setRating] = useState(selectedListItem!.rating)
	const insets = useSafeAreaInsets()
	const [confirmationOpen, setConfirmationOpen] = useState(false)

	const handleSave = async () => {
		const newItem = {
			...selectedListItem!,
			title,
			description,
			rating,
			subTitle,
		}
		await updateListItem(newItem)
		showToast("Item updated")
		navigator.navigate("List")
	}
	const handleDelete = async () => {
		await deleteListItem(selectedListItem!.id)
		showToast("Item deleted")
		navigator.navigate("List")
	}

	const disabled =
		title === selectedListItem!.title &&
		description === selectedListItem!.description &&
		rating === selectedListItem!.rating &&
		subTitle === selectedListItem!.subTitle

	return (
		<ScrollView
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
			<Pressable hitSlop={10} onPress={() => navigator.goBack()}>
				<Text style={[styles.text, { marginBottom: 20 }]}>Back</Text>
			</Pressable>
			<View
				style={{
					marginBottom: 20,
				}}
			>
				<Text style={styles.text}>Title</Text>
				<TextInput
					value={title}
					style={styles.input}
					onChangeText={setTitle}
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
			</View>
			<View
				style={{
					marginBottom: 20,
				}}
			>
				<Text style={styles.text}>Sub Title</Text>
				<TextInput
					value={subTitle}
					style={styles.input}
					onChangeText={setSubTitle}
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
			</View>
			<View
				style={{
					marginBottom: 20,
				}}
			>
				<Text style={styles.text}>Rating:</Text>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					{[1, 2, 3, 4, 5].map((i) => (
						<Pressable
							key={i}
							style={[
								{
									height: 40,
									width: 40,
									justifyContent: "center",
									alignItems: "center",
									margin: 10,
								},
								rating === i ? styles.selectedRating : {},
							]}
							hitSlop={10}
							onPress={() => setRating(i)}
						>
							<Text style={{ color: colors.white }}>{i}</Text>
						</Pressable>
					))}
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					{[6, 7, 8, 9, 10].map((i) => (
						<Pressable
							key={i}
							style={[
								{
									height: 40,
									width: 40,
									justifyContent: "center",
									alignItems: "center",
									margin: 10,
								},
								rating === i ? styles.selectedRating : {},
							]}
							hitSlop={10}
							onPress={() => setRating(i)}
						>
							<Text style={{ color: colors.white }}>{i}</Text>
						</Pressable>
					))}
				</View>
			</View>
			<View>
				<Text style={styles.text}>Description</Text>
				<TextInput
					multiline
					value={description}
					style={[styles.input, styles.multiline]}
					onChangeText={setDescription}
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
				/>
			</View>
			<TouchableOpacity
				onPress={handleSave}
				style={[styles.button, { opacity: disabled ? 0.5 : 1 }]}
				disabled={disabled}
			>
				<Text style={styles.text}>Save</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => setConfirmationOpen(true)} style={styles.buttonDanger}>
				<Text style={styles.text}>Delete</Text>
			</TouchableOpacity>
			<Confirmation
				isOpen={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
				confirmText="Are you sure you want to delete this item?"
				onConfirm={handleDelete}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.darkBackground,
	},
	button: {
		marginVertical: 15,
		alignItems: "center",
		backgroundColor: colors.green,
		padding: 12,
		borderRadius: 4,
	},
	buttonDanger: {
		marginBottom: 100,
		alignItems: "center",
		backgroundColor: colors.red,
		padding: 12,
		borderRadius: 4,
	},
	text: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 20,
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
	},
	multiline: {
		height: 150,
	},
	picker: {
		backgroundColor: "#111",
		borderRadius: 4,
		marginVertical: 15,
		width: "100%",
	},
	pickerItem: {
		color: colors.white,
		fontFamily: "Gill Sans",
		fontSize: 25,
	},
	selectedRating: {
		backgroundColor: colors.green,
		borderRadius: 40,
	},
})
