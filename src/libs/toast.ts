import Toast, { ToastContainer } from "react-native-root-toast"

let toast: ToastContainer | null = null

const showToast = (message: string, duration: number = 3000) => {
  toast = Toast.show(message, {
    duration,
    onHidden: () => {
      toast = null
    },
  })
}

export const hideToast = () => {
  Toast.hide(toast)
}

export default showToast
