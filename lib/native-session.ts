import { Preferences } from "@capacitor/preferences"

const ACCESS_TOKEN_KEY = "stick_access_token"
const REFRESH_TOKEN_KEY = "stick_refresh_token"

export async function saveNativeSession({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) {
  await Preferences.set({
    key: ACCESS_TOKEN_KEY,
    value: accessToken,
  })

  await Preferences.set({
    key: REFRESH_TOKEN_KEY,
    value: refreshToken,
  })
}

export async function getNativeSession() {
  const accessToken = await Preferences.get({ key: ACCESS_TOKEN_KEY })
  const refreshToken = await Preferences.get({ key: REFRESH_TOKEN_KEY })

  if (!accessToken.value || !refreshToken.value) {
    return null
  }

  return {
    accessToken: accessToken.value,
    refreshToken: refreshToken.value,
  }
}

export async function clearNativeSession() {
  await Preferences.remove({ key: ACCESS_TOKEN_KEY })
  await Preferences.remove({ key: REFRESH_TOKEN_KEY })
}