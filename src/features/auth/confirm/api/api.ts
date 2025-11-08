import { api } from '@/shared/api';
import type { ConfirmRequest, ConfirmResponse } from './types';

export const confirm = async (payload: ConfirmRequest): Promise<void> => {
  await api.post<ConfirmResponse>('/auth/registration-confirmation', payload);
};


