import { useMutation } from '@tanstack/react-query';
import { RegisterResponse } from '@/features/auth/signUp/ui/SignUp';
import { SignUpErrorResponse, SignUpRequest } from '@/features/auth/signUp/api';


export const useSignUp = () => {
  return useMutation<RegisterResponse, Error | SignUpErrorResponse, SignUpRequest>({
    mutationFn: async (payload) => {
      const res = await fetch('https://inctagram.work/api/v1/auth/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if(res.status === 204) {
        return { statusCode: 204 } as RegisterResponse
      }

      if (!res.ok) {
        throw (data ?? {
          statusCode: res.status,
          messages: [{ field: 'root', message: res.statusText }],
          error: 'Bad Request',
        });
      }
      return data as RegisterResponse
    },
  });
};
