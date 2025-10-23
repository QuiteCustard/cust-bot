export type UserData = {
  discord: {
    username: string
    global_name: string | null
  }
  timezone?: string
  payments?: { [userId: string]: number }
}
