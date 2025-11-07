export type RegistrationSchema = {
  statusCode: number; // 400
  messages: {
    message: string;
    field: 'email' | 'password' | 'userName';
  }[];
  error: string; // "Bad Request"
};
