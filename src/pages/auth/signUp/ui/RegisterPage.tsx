'use client';

import { useSignUp } from '@/features/auth/signUp/hooks/useSignUp';
import { SignUpForm } from '@/features/auth/signUp/model';
import { SignUp } from '@/features/auth/signUp/ui';
import { SignUpErrorResponse } from '@/features/auth/signUp/api';


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

      if (result && 'statusCode' in result && result.statusCode === 204) {
        //вызов кастомной компоненты алерта
        alert(`We have sent a link to confirm your email to ${formData.email}`);
      }
      return result;
    } catch (err) {
      const e = err as Error | SignUpErrorResponse;
      if ('messages' in e) {
        e.messages.forEach(({ field, message }) => {
          // Можно передавать ошибки в форму через setError
          console.log(`Field: ${field}, Error: ${message}`);
        });
      }
      return err as SignUpErrorResponse;
    }
  };

  return (
    <SignUp
      onSubmit={handleRegister}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}

