export type ConfirmationSchema = {
  statusCode: number;
  messages: {
    message: string;
    field: string;
  }[];
  error: string;
};
