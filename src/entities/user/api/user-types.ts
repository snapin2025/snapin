export type User = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}

export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  accessToken: string
}
