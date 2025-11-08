export type SignUpRequest = {
  userName: string
  email: string
  password: string
}

export type SignUpSuccessResponse = {
  statusCode: 204;
};

export type  SignUpErrorResponse = {
  statusCode: number; // 400
  messages: {
    message: string;
    field: 'email' | 'password' | 'userName';
  }[];
  error: string; // "Bad Request"
}

export type SignUpResponse = SignUpErrorResponse | SignUpSuccessResponse
