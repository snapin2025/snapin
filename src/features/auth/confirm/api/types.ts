export type ConfirmRequest = {
  "confirmationCode": string
}

export type ConfirmErrorResponse = {
  statusCode: number;
  messages: {
    message: string;
    field: string;
  }[];
  error: string;
}

export type ConfirmResponse =  void | ConfirmErrorResponse
