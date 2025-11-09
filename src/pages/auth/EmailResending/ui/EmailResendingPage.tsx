'use client';

import { useSearchParams } from 'next/navigation';
import { useEmailResending } from '@/features/auth/emailResending';
import { useState } from 'react';
import { Button } from '@/shared/ui';
import Link from 'next/link';

export function EmailResendingPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') ?? '';
  const { mutateAsync, isPending } = useEmailResending();
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    debugger
    if (!emailParam) {
      setMessage('Missing email in request.');
      return;
    }
      console.log(emailParam);

    try {
      await mutateAsync({
        email: emailParam,
        baseUrl: 'http://localhost:3000',
      });
      setMessage('✅ Verification link has been resent! Check your email.');
    } catch (err: any) {
      if ('messages' in err) {
        setMessage(err.messages?.[0]?.message ?? 'Something went wrong');
      } else {
        setMessage(err.message ?? 'Something went wrong');
      }
    }
  };

  return (
    <div>
      <h2>Looks like the verification link has expired...</h2>
      <p>Please request a new verification link.</p>
      <Button
        onClick={handleResend}
        disabled={isPending}
      >
        Resend verification link
      </Button>
      {message && <p>{message}</p>}
      <Link href={'/auth/signUp'}>
        <Button variant={'textButton'}>Back to Sign Up</Button>
      </Link>
    </div>
  );
}
