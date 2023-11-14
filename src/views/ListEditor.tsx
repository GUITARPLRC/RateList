import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import useMyLists from "../hooks/useMyLists"
import { colors, themes } from "../styles"
import Confirmation from "../components/Confirmation"
import showToast from "../libs/toast"

export default function ListEditor() {
  const navigator = useNavigation<StackNavigationProp<RootStackParamList>>()

  const { selectedList, updateList, deleteList } = useMyLists()
  const [title, setTitle] = useState(selectedList!.title)
  const [theme, setTheme] = useState(selectedList!.theme)
  const insets = useSafeAreaInsets()
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  const handleSave = async () => {
    const newList = {
      ...selectedList!,
      title,
      theme,
    }
    await updateList(newList)
    showToast("List updated")
    navigator.navigate("List")
  }
  const handleDelete = async () => {
    await deleteList()
    showToast("List deleted")
    navigator.navigate("Home")
  }

  const disabled =
    title === selectedList!.title && theme === selectedList!.theme

  return (
    <View
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
      <Pressable onPress={() => navigator.goBack()}>
        <Text style={[styles.text, { marginBottom: 20 }]}>Back</Text>
      </Pressable>
      <TextInput
        value={title}
        style={styles.input}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.lightGrey}
        keyboardType="default"
      />
      <Picker
        selectedValue={theme}
        onValueChange={setTheme}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {Object.keys(themes).map((theme) => (
          <Picker.Item key={theme} label={theme} value={theme} />
        ))}
      </Picker>
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.button, { opacity: disabled ? 0.5 : 1 }]}
        disabled={disabled}
      >
        <Text style={styles.text}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setConfirmationOpen(true)}
        style={styles.buttonDanger}
      >
        <Text style={styles.text}>Delete</Text>
      </TouchableOpacity>
      <Confirmation
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        confirmText="Are you sure you want to delete this list?"
        onConfirm={handleDelete}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground,
    paddingHorizontal: 20,
    paddingTop: 70,
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
