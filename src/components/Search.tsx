import React, { FC } from "react"
import { StyleSheet, TextInput } from "react-native"
import { colors } from "../styles"

interface Props {
  searchValue: string
  setSearchValue: (value: string) => void
}

const Search: FC<Props> = ({ searchValue, setSearchValue }) => {
  return (
    <TextInput
      value={searchValue}
      style={styles.input}
      onChangeText={setSearchValue}
      placeholder="Search"
      placeholderTextColor={colors.lightGrey}
      keyboardType="default"
    />
  )
}

export default Search

const styles = StyleSheet.create({
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
})
