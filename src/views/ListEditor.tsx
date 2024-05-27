import { View, TextInput, StyleSheet, Text, Pressable } from "react-native"
import { useLayoutEffect, useState } from "react"
import { Picker } from "@react-native-picker/picker"
import useMyLists from "../hooks/useMyLists"
import { colors, themes } from "../styles"
import showToast from "../libs/toast"
import { navigationRef } from "../libs/navigationUtilities"
import { useNavigation } from "@react-navigation/native"

export default function ListEditor() {
	const { selectedList, updateList, deleteList, createList, setSelectedList } = useMyLists()
	const [title, setTitle] = useState(selectedList?.title || "")
	const [theme, setTheme] = useState(selectedList?.theme || "green")
	const navigation = useNavigation()

	const handleNewList = async () => {
		if (!selectedList?.id) {
			const data = await createList()
			setTitle("")
			setTheme("green")
			setSelectedList(data)
		}
	}

	useLayoutEffect(() => {
		handleNewList()
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={() => handleSave()} style={{ marginRight: 20 }}>
					<Text style={styles.text}>Save</Text>
				</Pressable>
			),
		})
	}, [selectedList])

	const handleSave = async () => {
		if (!selectedList?.id) return
		const newList = {
			...selectedList,
			title,
			theme,
		}
		await updateList(newList)
		showToast("List updated")
		navigationRef.navigate("List")
	}

	return (
		<View style={[styles.container]}>
			<View style={{ marginBottom: 20 }}>
				<Text style={[styles.text, { marginBottom: 10 }]}>Title</Text>
				<TextInput
					value={title}
					style={styles.input}
					onChangeText={setTitle}
					placeholder="Add a Title!"
					placeholderTextColor={colors.lightGrey}
					keyboardType="default"
					autoFocus={!title}
				/>
			</View>
			<View>
				<Text style={styles.text}>Theme</Text>
				<Picker
					selectedValue={theme}
					onValueChange={setTheme}
					style={styles.picker}
					itemStyle={styles.pickerItem}
				>
					{Object.keys(themes).map((themeItem) => (
						<Picker.Item key={themeItem} label={themeItem} value={themeItem} />
					))}
				</Picker>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.darkBackground,
		padding: 20,
	},
	button: {
		marginBottom: 15,
		alignItems: "center",
		backgroundColor: colors.green,
		padding: 12,
		borderRadius: 4,
	},
	buttonDanger: {
		marginBottom: 15,
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
})
