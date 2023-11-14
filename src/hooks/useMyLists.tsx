import { useContext } from "react"
import { MyListsContext } from "../context/myLists"

export default function useMyLists() {
  return useContext(MyListsContext)
}
