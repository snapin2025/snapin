import { useMutation } from '@tanstack/react-query';
import { signUp, SignUpErrorResponse, SignUpRequest, SignUpResponse } from '@/features/auth/signUp/api';


export const useSignUp = () => {
  return useMutation<SignUpResponse, Error | SignUpErrorResponse, SignUpRequest>({
    mutationFn: async (payload) => {
      try {
        const res = await signUp(payload);
        return res;
      } catch (err: any) {
        if (err.response?.data) {
          throw err.response.data as SignUpErrorResponse;
        }
        throw err;
      }
    },
  });
};
