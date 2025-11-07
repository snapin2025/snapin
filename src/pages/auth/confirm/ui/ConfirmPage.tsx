'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirmRegistrationMutation } from '@/features/auth/confirm/model/useConfirmRegistrationMutation';

export function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = useConfirmRegistrationMutation();

  useEffect(() => {
    const code = searchParams?.get('code');

    if (!code) {
      alert('Confirmation code missing!');
      router.push('/signUp');
      return;
    }

    const confirm = async () => {
      try {
        await mutateAsync({confirmationCode: code});
        alert('🎉 Congratulations! Your email has been confirmed!')
        router.push('/signIn');
        } catch (err: any) {
        alert(err?.messages?.[0]?.message ?? err?.message ?? 'Something went wrong');
        router.push('/signUp');
      }
    };

    void confirm();
  }, [mutateAsync, router, searchParams]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {isPending ? 'Confirming your account...' : 'Redirecting...'}
    </div>
  );
};
