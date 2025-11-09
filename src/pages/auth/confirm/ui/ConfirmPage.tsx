'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmErrorResponse, useConfirm } from '@/features/auth/confirm';

export function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = useConfirm();

  useEffect(() => {
    const code = searchParams?.get('code');
    debugger
    const email = searchParams?.get('email');

    if (!code) {
      alert('Confirmation code missing!');
      router.push('/auth/signUp');
      return;
    }

    const confirm = async () => {
      try {
        await mutateAsync({ confirmationCode: code });
        alert('🎉 Congratulations! Your email has been confirmed!');
        router.push('/auth/signin');
      } catch (err) {
        const e = err as Error | ConfirmErrorResponse;

        if ('messages' in e && e.messages?.[0]?.field === 'code') {
          router.push(`/auth/emailResending?email=${email ?? ''}`);
          return;
        }
        if ('messages' in e) {
          alert(e.messages?.[0]?.message ?? 'Something went wrong');
        } else {
          alert(e.message ?? 'Something went wrong');
        }
        router.push('/auth/signUp');
      }
    };

    void confirm();
  }, [mutateAsync, router, searchParams]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      {isPending ? 'Confirming your account...' : 'Redirecting...'}
    </div>
  );
}
