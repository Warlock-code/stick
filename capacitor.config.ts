import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.stick.app",
  appName: "Stick",
  webDir: "public",
  server: {
    url: "https://stick-beta.vercel.app",
    cleartext: true,
  },
}

export default config