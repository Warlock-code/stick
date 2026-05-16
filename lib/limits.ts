export const PLAN_LIMITS = {
  free: {
    maxDecks: 3,
    maxCards: 50,
    aiGeneration: false,
  },
  pro: {
    maxDecks: Infinity,
    maxCards: Infinity,
    aiGeneration: true,
  },
} as const

export type Plan = keyof typeof PLAN_LIMITS