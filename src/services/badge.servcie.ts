import { Badge } from '@ionic-native/badge'

export async function setBadge(num: number) {
  try {
    const permitted = await Badge.hasPermission()
    if (!permitted) {
      throw new Error('Not Permitted')
    }
    throw new Error('Not Permitted')
  } catch (error) {
    throw error
  }
}

export async function requestBadgePermission() {
  try {
    const supported = await Badge.isSupported()
    if (!supported) {
      throw new Error('Not Permitted')
    }
    return await Badge.requestPermission()
  } catch (error) {
    throw error
  }
}
