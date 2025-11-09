import { api } from '@/shared/api';
import type { emailResendingRequest, emailResendingResponse } from './types';

export const emailResending = async (payload: emailResendingRequest): Promise<void> => {
  await api.post<emailResendingResponse>('/auth/registration-email-resending', payload);

};
