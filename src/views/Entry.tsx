import Login from "./Login"
import Home from "./Home"
import List from "./List"
import ListEditor from "./ListEditor"
import Profile from "./Profile"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ItemEditor from "./ItemEditor"
import ResetPassword from "./ResetPassword"
import SignUp from "./SignUp"
import ForgotPassword from "./ForgotPassword"
import TokenEntry from "./TokenEntry"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Entry() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
			<Stack.Screen name="Login" component={Login} options={{ gestureEnabled: false }} />
			<Stack.Screen
				name="ResetPassword"
				component={ResetPassword}
				options={{ gestureEnabled: false }}
			/>
			<Stack.Screen name="SignUp" component={SignUp} options={{ gestureEnabled: false }} />
			<Stack.Screen
				name="ForgotPassword"
				component={ForgotPassword}
				options={{ gestureEnabled: false }}
			/>
			<Stack.Screen name="TokenEntry" component={TokenEntry} options={{ gestureEnabled: false }} />
			<Stack.Screen name="Profile" component={Profile} options={{ gestureEnabled: false }} />
			<Stack.Screen name="Home" component={Home} options={{ gestureEnabled: false }} />
			<Stack.Screen name="List" component={List} options={{ gestureEnabled: false }} />
			<Stack.Screen name="ListEditor" component={ListEditor} />
			<Stack.Screen name="ItemEditor" component={ItemEditor} />
		</Stack.Navigator>
	)
}
