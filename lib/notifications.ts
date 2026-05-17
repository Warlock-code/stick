import { LocalNotifications } from "@capacitor/local-notifications"

export async function requestNotificationPermission() {
  await LocalNotifications.requestPermissions()
}

export async function scheduleDailyReminder() {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: "Stick Reminder 🧠",
        body: "You have flashcards waiting for review.",
        schedule: {
          repeats: true,
          every: "day",
          on: {
            hour: 18,
            minute: 0,
          },
        },
      },
    ],
  })
}