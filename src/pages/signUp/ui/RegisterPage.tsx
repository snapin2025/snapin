'use client';

import { useRegisterMutation } from '@/features/auth/register/model/useRegisterMutation';
import { RegisterForm } from '@/features/auth/register/ui';
import { z } from 'zod/v4';
import { registerSchema } from '@/features/auth/register/lib/shemas/registerShema';
import { RegistrationSchema } from '@/shared/api/responseTypes/RegistrationSchema';

type FormValue = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { mutateAsync, isPending, error } = useRegisterMutation();

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

  const handleRegister = async (formData: FormValue) => {
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
    <RegisterForm
      onSubmit={handleRegister}
      isLoading={isPending}
      error={error ? (error as Error).message : null}
    />
  );
}

