import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.stick.app",
  appName: "Stick",
  webDir: "public",
  server: {
    url: "https://stick-beta.vercel.app/mobile-boot",
    cleartext: true,
    androidScheme: "https",
  },
}

export default config