export const REQUEST_STATUSES = [
      "draft",
      "submitted",
      "approved",
      "fulfilled",
      "completed",
      "cancelled",
] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]

const TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
      draft: ["submitted", "cancelled"],
      submitted: ["approved", "cancelled"],
      approved: ["fulfilled", "cancelled"],
      fulfilled: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
}

export function canTransition(fromStatus: string, toStatus: string) {
      if (!REQUEST_STATUSES.includes(fromStatus as RequestStatus)) return false
      if (!REQUEST_STATUSES.includes(toStatus as RequestStatus)) return false
      return TRANSITIONS[fromStatus as RequestStatus].includes(toStatus as RequestStatus)
}