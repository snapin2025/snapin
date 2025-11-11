export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  accessToken: string
}

export type UserMeResponse = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}

export type SignInErrorResponse = {
  statusCode: number
  messages: string
  error: string
}
