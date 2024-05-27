import { StyleSheet, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AuthProvider from "./src/context/auth"
import MyListsProvider from "./src/context/myLists"
import Entry from "./src/views/Entry"
import { colors } from "./src/styles"
import { ModalPortal } from "react-native-modals"
import { RootSiblingParent } from "react-native-root-siblings"
import { useState, useEffect, useCallback } from "react"
import * as SplashScreen from "expo-splash-screen"
import { ActionSheetProvider } from "@expo/react-native-action-sheet"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			try {
				// Artificially delay for two seconds to simulate a slow loading
				// experience. Please remove this if you copy and paste the code!
				await new Promise((resolve) => setTimeout(resolve, 1000))
			} catch (e) {
				console.warn(e)
			} finally {
				// Tell the application to render
				setAppIsReady(true)
			}
		}

		prepare()
	}, [])

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync()
		}
	}, [appIsReady])

	if (!appIsReady) {
		return null
	}
	return (
		<View onLayout={onLayoutRootView} style={styles.safeArea}>
			<RootSiblingParent>
				<SafeAreaProvider style={styles.safeArea}>
					<AuthProvider>
						<MyListsProvider>
							<NavigationContainer>
								<ActionSheetProvider>
									<Entry />
								</ActionSheetProvider>
								<ModalPortal />
							</NavigationContainer>
						</MyListsProvider>
					</AuthProvider>
				</SafeAreaProvider>
			</RootSiblingParent>
		</View>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.darkBackground,
	},
})
