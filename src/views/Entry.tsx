import Login from "./Login"
import Home from "./Home"
import List from "./List"
import ListEditor from "./ListEditor"
import Profile, { avatars } from "./Profile"
import ItemEditor from "./ItemEditor"
import ResetPassword from "./ResetPassword"
import SignUp from "./SignUp"
import ForgotPassword from "./ForgotPassword"
import TokenEntry from "./TokenEntry"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLogin } from "../hooks/useLogin"
import React, { useLayoutEffect, useState } from "react"
import { Pressable, StyleSheet, View, Text, Image } from "react-native"
import { Entypo } from "@expo/vector-icons"
import { useAuth } from "../context/auth"
import { Stack, Tab, authNavigationRef, navigationRef } from "../libs/navigationUtilities"
import useMyLists from "../hooks/useMyLists"

const renderBackButton = (screen?: "Home" | "List") => {
	const { goBack } = useNavigation()
	return (
		<Pressable
			onPress={() => (screen ? navigationRef.navigate(screen) : goBack())}
			style={{ marginLeft: 20 }}
		>
			<Entypo name="arrow-left" size={30} color="#fff" />
		</Pressable>
	)
}

const AuthStack = () => {
	return (
		<NavigationContainer independent ref={authNavigationRef}>
			<Stack.Navigator
				screenOptions={{
					gestureEnabled: false,
					headerShown: false,
				}}
				initialRouteName="Login"
			>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="ResetPassword" component={ResetPassword} />
				<Stack.Screen name="SignUp" component={SignUp} />
				<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
				<Stack.Screen name="TokenEntry" component={TokenEntry} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

const CustomTabs = ({ state }: any) => {
	const focusedOptions = state.routes[state.index]
	const { profile } = useAuth()
	const [avatar, setAvatar] = useState<string>()
	useLayoutEffect(() => {
		setAvatar(profile?.avatar)
	}, [profile])

	return (
		<View style={styles.tabBar}>
			<Pressable
				key={"Home"}
				style={focusedOptions.name === "Home" ? styles.tabActive : styles.tabInactive}
				onPress={() => {
					navigationRef?.navigate("Home")
				}}
			>
				{/* home icon */}
				<Entypo name="home" size={25} color={focusedOptions.name === "Home" ? "#f25555" : "#fff"} />
				<Text
					style={{ ...styles.tabLabel, color: focusedOptions.name === "Home" ? "#f25555" : "#fff" }}
				>
					Home
				</Text>
			</Pressable>
			<Pressable
				key={"Profile"}
				style={focusedOptions.name === "Profile" ? styles.tabActive : styles.tabInactive}
				onPress={() => navigationRef?.navigate("Profile")}
			>
				{avatar ? (
					<Image
						source={avatars[avatar as keyof typeof avatars]}
						style={{ width: 30, height: 30 }}
					/>
				) : (
					<Entypo
						name="user"
						size={30}
						color={focusedOptions.name === "Profile" ? "#f25555" : "#fff"}
					/>
				)}
				<Text
					style={{
						...styles.tabLabel,
						color: focusedOptions.name === "Profile" ? "#f25555" : "#fff",
					}}
				>
					{profile?.username
						? profile.username.length > 10
							? `${profile.username.substring(0, 10)}...`
							: profile.username
						: "Profile"}
				</Text>
			</Pressable>
		</View>
	)
}

const MainStack = () => {
	const { createList } = useMyLists()

	return (
		<NavigationContainer independent ref={navigationRef}>
			<Tab.Navigator
				backBehavior="history"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#000",
					},
					headerTitleStyle: {
						color: "#fff",
						fontSize: 20,
					},
					tabBarActiveTintColor: "#f25555",
					tabBarInactiveTintColor: "#CCC",
					tabBarStyle: {
						backgroundColor: "#000",
					},
				}}
				initialRouteName="Home"
				tabBar={(props: any) => <CustomTabs {...props} />}
			>
				<Tab.Screen
					name="Home"
					component={Home}
					options={{
						title: "My Lists",
						headerRight: () => {
							return (
								<Pressable onPress={createList} style={{ marginRight: 20 }}>
									<Entypo name="plus" size={30} color="#fff" />
								</Pressable>
							)
						},
					}}
				/>
				<Tab.Screen
					name="List"
					component={List}
					options={{
						headerLeft: () => renderBackButton("Home"),
					}}
				/>
				<Tab.Screen
					name="ListEditor"
					component={ListEditor}
					options={{
						title: "Edit List",
						headerLeft: () => renderBackButton("List"),
					}}
				/>
				<Tab.Screen
					name="ItemEditor"
					component={ItemEditor}
					options={{ title: "Edit Item", headerLeft: () => renderBackButton("List") }}
				/>
				<Tab.Screen
					name="Profile"
					component={Profile}
					options={{
						headerLeft: () => renderBackButton("Home"),
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	)
}

export default function Entry() {
	const { profile } = useAuth()
	const { handleSignIn } = useLogin()

	useLayoutEffect(() => {
		AsyncStorage.getItem("remember").then((data) => {
			if (data) {
				const { email, password } = JSON.parse(data)
				if (email && password && !profile) {
					handleSignIn({ email, password })
				}
			}
		})
	}, [profile])
	return (
		<NavigationContainer independent>{profile ? <MainStack /> : <AuthStack />}</NavigationContainer>
	)
}

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "#000 ",
		borderWidth: 1,
		borderTopColor: "#333",
		paddingVertical: 20,
	},
	tabActive: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	tabInactive: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	tabLabel: {
		color: "#ccc",
		marginTop: 10,
	},
})
