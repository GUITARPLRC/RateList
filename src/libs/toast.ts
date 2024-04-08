import Toast, { ToastContainer } from "react-native-root-toast"

let toast: ToastContainer | null = null

const showToast = (message: string, duration: number = 3000) => {
	toast = Toast.show(message, {
		duration,
		onHidden: () => {
			toast = null
		},
		containerStyle: {
			backgroundColor: "rgba(255,255,255,0.8)",
		},
		textStyle: {
			color: "black",
		},
	})
}

export const hideToast = () => {
	Toast.hide(toast)
}

export default showToast
