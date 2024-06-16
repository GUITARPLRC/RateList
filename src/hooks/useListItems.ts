import { useEffect, useState } from "react"
import supabase from "../config/supabase"
import { useMyLists } from "../context/myLists"
import { useBadges } from "./useBadges"
import showToast from "../libs/toast"

export const useListItems = () => {
	const { selectedList } = useMyLists()
	const [listItems, setListItems] = useState<Item[]>([])
	const [itemData, setItemData] = useState<Item[]>([])
	const [loading, setLoading] = useState(false)
	const [searchValue, setSearchValue] = useState("")
	const [sortValue, setSortValue] = useState<SortValue>(selectedList?.sortKey ?? "Title Asc")
	const { checkBadges } = useBadges()

	useEffect(() => {
		filterSortData()
	}, [searchValue, itemData, sortValue])

	const filterSortData = () => {
		if (itemData) {
			let sortedData = [...itemData]
			if (searchValue) {
				sortedData = itemData.filter((item) => {
					const title = item.title?.toLocaleLowerCase()
					const subtitle = item.subTitle?.toLocaleLowerCase()
					const rating = item.rating?.toString()
					const search = searchValue.toLocaleLowerCase()

					return title?.includes(search) || subtitle?.includes(search) || rating?.includes(search)
				})
			}
			const newlySortedData = sortedData.sort((a, b) => {
				if (sortValue === "Title Asc") {
					return (a.title?.toLocaleLowerCase() ?? "").localeCompare(
						b.title?.toLocaleLowerCase() ?? "",
					)
				} else if (sortValue === "Title Desc") {
					return (b.title?.toLocaleLowerCase() ?? "").localeCompare(
						a.title?.toLocaleLowerCase() ?? "",
					)
				} else if (sortValue === "Rating Asc") {
					return (a.rating ?? 0) - (b.rating ?? 0)
				} else if (sortValue === "Rating Desc") {
					return (b.rating ?? 0) - (a.rating ?? 0)
				} else if (sortValue === "Subtitle Asc") {
					return (a.subTitle?.toLocaleLowerCase() ?? "").localeCompare(
						b.subTitle?.toLocaleLowerCase() ?? "",
					)
				} else if (sortValue === "Subtitle Desc") {
					return (b.subTitle?.toLocaleLowerCase() ?? "").localeCompare(
						a.subTitle?.toLocaleLowerCase() ?? "",
					)
				} else {
					return 0
				}
			})
			setListItems(newlySortedData)
		}
	}

	const fetchListItems = async () => {
		if (loading || !selectedList?.id) {
			return
		}
		try {
			setLoading(true)
			setSortValue(selectedList.sortKey ?? "Title Asc")
			let { data, error } = await supabase
				.from("listitems")
				.select("*")
				.eq("listId", selectedList.id)
			if (error) {
				throw new Error(error.message)
			} else if (data) {
				setItemData(data)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error fetching list items")
			}
		} finally {
			setLoading(false)
		}
	}

	const addListItem = async (): Promise<Item | undefined> => {
		let newItemData = null
		if (loading || !selectedList?.id) return
		try {
			setLoading(true)
			const { data, error } = await supabase
				.from("listitems")
				.insert([{ title: "New List Item", description: "", listId: selectedList.id }])
				.select()
			if (data) {
				newItemData = data[0]
			}

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error adding list item")
			}
		} finally {
			setLoading(false)
			if (newItemData) {
				return newItemData
			}
		}
	}

	const deleteListItem = async (id: string) => {
		if (loading) return
		try {
			setLoading(true)
			const { error } = await supabase.from("listitems").delete().eq("id", id)
			if (error) {
				throw new Error(error.message)
			} else {
				fetchListItems()
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error deleting list item")
			}
		} finally {
			setLoading(false)
		}
	}

	const updateListItem = async (updates: Partial<Item>) => {
		if (loading) return
		try {
			setLoading(true)
			const { error } = await supabase.from("listitems").upsert(updates)
			if (error) {
				throw new Error(error.message)
			} else {
				if (updates.rating) {
					checkBadges("addRating")
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message)
				showToast("Error updating list item")
			}
		} finally {
			setLoading(false)
		}
	}

	return {
		listItems,
		addListItem,
		deleteListItem,
		updateListItem,
		loading,
		fetchListItems,
		searchValue,
		setSearchValue,
		sortValue,
		setSortValue,
	}
}
