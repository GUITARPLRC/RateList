import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNavigationContainerRef } from "@react-navigation/native"

export const Stack = createNativeStackNavigator<RootStackParamList>()
export const Tab = createBottomTabNavigator<RootStackParamList>()

export const navigationRef = createNavigationContainerRef<RootStackParamList>()
export const authNavigationRef = createNavigationContainerRef<RootStackParamList>()
