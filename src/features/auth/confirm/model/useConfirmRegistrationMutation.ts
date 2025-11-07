import { useMutation } from '@tanstack/react-query';
import { ConfirmationSchema } from '@/shared/api/responseTypes/ConfirmationSchema';

type ConfirmPayload = {
  confirmationCode: string;
};

export const useConfirmRegistrationMutation = () => {
  return useMutation<void, Error | ConfirmationSchema, ConfirmPayload>({
    mutationFn: async (payload) => {
      const res = await fetch('https://inctagram.work/api/v1/auth/registration-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: ConfirmationSchema | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.status !== 204 && !res.ok) {
        throw data ?? {
          statusCode: res.status,
          messages: [{ field: 'root', message: res.statusText }],
          error: 'Bad Request',
        };
      }
      return;
    },
  });
};
