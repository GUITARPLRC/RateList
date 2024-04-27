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
import { NavigationContainer } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLogin } from "../hooks/useLogin"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { Pressable, StyleSheet, View, Text, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "../context/auth"
import { Stack, Tab, navigationRef } from "../libs/navigationUtilities"
import { useListItems } from "../hooks/useListItems"
import useMyLists from "../hooks/useMyLists"

const renderBackButton = () => {
	return (
		<Pressable onPress={() => navigationRef?.goBack()} style={{ marginLeft: 20 }}>
			<Feather name="arrow-left" size={30} color="#fff" />
		</Pressable>
	)
}

const AuthStack = () => {
	return (
		<NavigationContainer independent>
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
				<Feather
					name="home"
					size={30}
					color={focusedOptions.name === "Home" ? "#f25555" : "#fff"}
				/>
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
					<Feather
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
					Profile
				</Text>
			</Pressable>
		</View>
	)
}

const MainStack = () => {
	const { setSelectedListItem, setSelectedList } = useMyLists()
	const { addListItem } = useListItems()
	const handleAddListItem = async () => {
		const newItem = {
			title: "",
			description: "",
		}
		const newListItem = await addListItem(newItem)
		if (!newListItem) return
		setSelectedListItem(newListItem)
		navigationRef.navigate("ItemEditor")
	}

	return (
		<NavigationContainer independent ref={navigationRef}>
			<Tab.Navigator
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
								<Pressable
									onPress={() => {
										setSelectedList(null)
										navigationRef?.navigate("ListEditor")
									}}
									style={{ marginRight: 20 }}
								>
									<Feather name="plus" size={30} color="#fff" />
								</Pressable>
							)
						},
					}}
				/>
				<Tab.Screen
					name="List"
					component={List}
					options={{
						headerLeft: () => renderBackButton(),
						headerRight: () => {
							return (
								<View style={styles.listRightHeader}>
									<Pressable style={{ marginRight: 20 }}>
										<Feather name="more-horizontal" size={30} color="#fff" />
									</Pressable>
									<Pressable onPress={() => handleAddListItem()} style={{ marginRight: 20 }}>
										<Feather name="plus" size={30} color="#fff" />
									</Pressable>
								</View>
							)
						},
					}}
				/>
				<Tab.Screen
					name="ListEditor"
					component={ListEditor}
					options={{
						title: "Edit List",
						headerLeft: () => renderBackButton(),
						headerRight: () => {
							return (
								<View style={styles.listRightHeader}>
									<Pressable style={{ marginRight: 20 }}>
										<Feather name="more-horizontal" size={30} color="#fff" />
									</Pressable>
									<Pressable onPress={() => handleAddListItem()} style={{ marginRight: 20 }}>
										<Text style={{ color: "#fff" }}>Save</Text>
									</Pressable>
								</View>
							)
						},
					}}
				/>
				<Tab.Screen name="ItemEditor" component={ItemEditor} options={{ title: "Edit Item" }} />
				<Tab.Screen
					name="Profile"
					component={Profile}
					options={{
						headerLeft: () => renderBackButton(),
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
	listRightHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
})
