import { Card, Checkbox, Github, Google, Input } from '@/shared/ui';
import s from './SignUp.module.css';
import { Button } from '@/shared/ui/button/Button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpForm, SignUpSchema } from '@/features/auth/signUp/model';
import { SignUpErrorResponse, SignUpSuccessResponse } from '@/features/auth/signUp/api';


export type RegisterResponse = SignUpErrorResponse | SignUpSuccessResponse

type Props = {
  error?: string | null
  isLoading?: boolean
  onSubmit: (data: SignUpForm) => Promise<RegisterResponse>
}

export const SignUp = ({ error, isLoading = false, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: { email: '', password: '', agree: false, confirmPassword: '', userName: '' },
    resolver: zodResolver(SignUpSchema),
  });

  const handleFormSubmit = async (data: SignUpForm) => {
    try {
      const res = await onSubmit(data);

      if (!res) {
        reset();
        console.log(res);
        return;
      }

      if ('statusCode' in res && res.statusCode === 400) {
        res.messages.forEach(({ field, message }) => {
          switch (field) {
            case 'email':
            case 'password':
            case 'userName':
              setError(field, { message });
              break;
            default:
              setError('root', { message: 'Unknown field error' });
          }
        });
        return;
      }
      if (res.statusCode === 204) {
        console.log(res);
        reset();
      }
    } catch (err: unknown) {
      console.error('Unexpected error:', err);
      setError('root', { message: 'Unexpected error' });
    }
  };

  return (
    <Card className={s.card} as="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className={s.title}>Sign Up</h2>
      <div className={s.containerBtn}>
        <Google />
        <Github />
      </div>
      <div className={s.containerInput}>
        <Input
          label="User name"
          type="text"
          id="Username"
          placeholder="Epam11"
          error={errors.userName?.message ?? error ?? undefined}
          {...register('userName')}
          className={s.inputCustom}
        />
      </div>
      <div className={s.containerInput}>
        <Input
          label="Email"
          type="email"
          id="Email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
          className={s.inputCustom}
        />
      </div>
      <div className={s.containerInput}>
        <Input
          label="Password"
          type="password"
          id="Password"
          placeholder="******************"
          error={errors.password?.message}
          {...register('password')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerInput}>
        <Input
          label="Password Сonfirmation"
          type="password"
          id="confirmPassword"
          placeholder="******************"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerIAgree}>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
        />
        <span className={s.paragraph}>
          I agree to the <a href={'/'}>Terms of Service</a> and <a href={'./'}>Privacy Policy</a>
        </span>
      </div>
      <Button variant={'primary'} type="submit" className={s.buttonFoolWidth}
              disabled={isLoading}>
        Sign Up
      </Button>
      <p className={s.paragraph}>Do you have an account?</p>
      <Button variant={'textButton'}>Sign In</Button>
    </Card>
  );
};


