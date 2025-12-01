export type emailResendingRequest = {
  email: string
  baseUrl: 'http://localhost:3000'
}

export type emailResendingErrorResponse = {
  statusCode: number
  messages: {
    message: string
    field: string
  }[]
  error: string
}

export type emailResendingResponse = void | emailResendingErrorResponse
