import React, {
	createContext,
	useState,
	Dispatch,
	SetStateAction,
	PropsWithChildren,
	useContext,
	useEffect,
} from "react"
import { useAuth } from "./auth"
import supabase from "../config/supabase"
import { useBadges } from "../hooks/useBadges"
import showToast from "../libs/toast"

interface Props {
	myLists: List[] | null
	selectedList: List | null
	setSelectedList: Dispatch<SetStateAction<List | null>>
	selectedListItem: Item | null
	setSelectedListItem: Dispatch<SetStateAction<Item | null>>
	updateList: (list: List) => Promise<void>
	createList: () => Promise<void>
	deleteList: () => Promise<void>
	getLists: () => Promise<void>
	loading: boolean
	searchValue: string
	setSearchValue: Dispatch<SetStateAction<string>>
	clearListData: () => void
}

const DEFAULT_LIST: Partial<List> = {
	title: "New List",
	theme: "green",
	description: "",
}

export const MyListsContext = createContext<Props>({
	myLists: [],
	selectedList: null,
	setSelectedList: () => {},
	selectedListItem: null,
	setSelectedListItem: () => {},
	updateList: () => Promise.resolve(),
	createList: () => Promise.resolve(),
	deleteList: () => Promise.resolve(),
	getLists: () => Promise.resolve(),
	loading: false,
	searchValue: "",
	setSearchValue: () => {},
	clearListData: () => {},
})

export function useMyLists() {
	return useContext(MyListsContext)
}

export default function MyListsProvider({ children }: PropsWithChildren) {
	const [myLists, setMyLists] = useState<List[] | null>([])
	const [listData, setListData] = useState<List[] | null>([])
	const [selectedList, setSelectedList] = useState<List | null>(null)
	const [selectedListItem, setSelectedListItem] = useState<Item | null>(null)
	const [loading, setLoading] = useState(false)
	const { profile } = useAuth()
	const [searchValue, setSearchValue] = useState("")
	const { checkBadges } = useBadges()

	useEffect(() => {
		filterListData()
	}, [searchValue, listData])

	const clearListData = () => {
		setMyLists(null)
	}

	const filterListData = () => {
		if (listData) {
			let sortedData = listData
			if (searchValue !== "") {
				sortedData = listData.filter((list) => {
					if (list.title?.toLowerCase().includes(searchValue.toLowerCase())) return true
					return false
				})
			}
			setMyLists(sortedData)
		}
	}

	const getLists = async () => {
		if (loading || !profile?.id) return
		try {
			setLoading(true)
			const { data, error } = await supabase.from("lists").select("*").eq("userId", profile.id)

			if (error) {
				throw new Error(error.message)
			} else if (data) {
				// use search value if present to filter lists
				// based on title
				let sortedData = data
				if (searchValue) {
					sortedData = data.filter((list) => {
						if (list.title?.includes(searchValue.toLowerCase())) return true
						return false
					})
				}
				setListData(sortedData)
				if (selectedList) {
					const newList = sortedData.find((list) => list.id === selectedList.id)
					setSelectedList(newList ? newList : null)
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error getting lists")
			}
		} finally {
			setLoading(false)
		}
	}

	const updateList = async (list: List) => {
		if (loading) return
		try {
			setLoading(true)
			const { error } = await supabase.from("lists").upsert(list)
			if (error) {
				throw new Error(error.message)
			} else {
				getLists()
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error updating list")
			}
		} finally {
			setLoading(false)
		}
	}

	const createList = async () => {
		if (loading || !profile?.id) return
		try {
			setLoading(true)

			const newList = { ...DEFAULT_LIST, userId: profile.id }
			const { error } = await supabase.from("lists").insert(newList)

			if (error) {
				throw new Error(error.message)
			} else {
				checkBadges("addList")
				getLists()
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error creating list")
			}
		} finally {
			setLoading(false)
		}
	}

	const deleteList = async () => {
		if (loading || !selectedList) return
		try {
			setLoading(true)

			const { error } = await supabase.from("lists").delete().eq("id", selectedList.id)

			if (error) {
				throw new Error(error.message)
			} else {
				checkBadges("deleteList")
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error deleting list")
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<MyListsContext.Provider
			value={{
				myLists,
				selectedList,
				setSelectedList,
				selectedListItem,
				setSelectedListItem,
				updateList,
				createList,
				deleteList,
				getLists,
				loading,
				searchValue,
				setSearchValue,
				clearListData,
			}}
		>
			{children}
		</MyListsContext.Provider>
	)
}