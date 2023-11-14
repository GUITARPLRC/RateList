import { StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AuthProvider from "./src/context/auth"
import MyListsProvider from "./src/context/myLists"
import Entry from "./src/views/Entry"
import { colors } from "./src/styles"
import { ModalPortal } from "react-native-modals"
import { RootSiblingParent } from "react-native-root-siblings"

export default function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider style={styles.safeArea}>
        <AuthProvider>
          <MyListsProvider>
            <NavigationContainer>
              <Entry />
              <ModalPortal />
            </NavigationContainer>
          </MyListsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </RootSiblingParent>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.darkBackground,
  },
})
