interface Item {
  id: string
  title: string
  checked: boolean
  priority: string
  label: string
  description: string
  subTitle: string
  rating: number
}

interface List {
  id: string
  title: string
  description: string
  userId: string
  theme: string
  items: Item[]
}
