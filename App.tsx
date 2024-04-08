import { StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import AuthProvider from "./src/context/auth"
import MyListsProvider from "./src/context/myLists"
import Entry from "./src/views/Entry"
import { colors } from "./src/styles"
import { ModalPortal } from "react-native-modals"
import { RootSiblingParent } from "react-native-root-siblings"
import * as Sentry from "@sentry/react-native"
import { version } from "./package.json"

Sentry.init({
	dsn: "https://e78063c2846d84a13206ee312bfb50c3@o4506352418816000.ingest.us.sentry.io/4507047516962816",
	// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
	// We recommend adjusting this value in production.
	tracesSampleRate: __DEV__ ? 1.0 : 0.1,
	_experiments: {
		// profilesSampleRate is relative to tracesSampleRate.
		// Here, we'll capture profiles for 100% of transactions.
		profilesSampleRate: 1.0,
	},
	release: __DEV__ ? "development" : version,
	debug: __DEV__,
})

function App() {
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

export default Sentry.wrap(App)

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.darkBackground,
	},
})
