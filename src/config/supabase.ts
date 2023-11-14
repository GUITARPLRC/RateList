import * as SecureStore from "expo-secure-store"
import "react-native-url-polyfill/auto"

import { createClient } from "@supabase/supabase-js"

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key)
  },
}

const url = process.env.EXPO_PUBLIC_DB_URL
const key = process.env.EXPO_PUBLIC_DB_KEY

export default createClient(url!, key!, {
  auth: {
    detectSessionInUrl: false,
    storage: ExpoSecureStoreAdapter,
  },
})
