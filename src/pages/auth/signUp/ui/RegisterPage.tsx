'use client';

import { useSignUp } from '@/features/auth/signUp/hooks/useSignUp';
import { RegistrationSchema } from '@/shared/api/responseTypes/RegistrationSchema';
import { SignUpForm } from '@/features/auth/signUp/model';
import { SignUp } from '@/features/auth/signUp/ui';


export function RegisterPage() {
  const { mutateAsync, isPending, error } = useSignUp();

  let errorMessage: string | null = null;

  if (error) {
    // если это ошибка от backend-а
    if ('messages' in error) {
      errorMessage = error.messages?.[0]?.message ?? null;
    }
    // если это системная (например network)
    else {
      errorMessage = error.message;
    }
  }

  const handleRegister = async (formData: SignUpForm) => {
    try {
      const result = await mutateAsync({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      if ('statusCode' in result && result.statusCode === 204) {
        //вызов кастомной компоненты алерта
        alert(`We have sent a link to confirm your email to ${formData.email}`);
      }
      return result;
    } catch (err) {
      return err as RegistrationSchema;
    }
  };

  return (
    <SignUp
      onSubmit={handleRegister}
      isLoading={isPending}
      error={error ? (error as Error).message : null}
    />
  );
}

