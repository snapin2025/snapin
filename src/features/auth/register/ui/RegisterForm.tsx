import { Card, Checkbox, Github, Google, Input } from '@/shared/ui'
import s from './RegisterForm.module.css'
import { Button } from '@/shared/ui/button/Button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { registerSchema } from '@/features/auth/register/lib/shemas/registerShema'
import { zodResolver } from '@hookform/resolvers/zod'

type FormValue = z.infer<typeof registerSchema>

type Props = {
  error?: string
  onSubmit: (data: FormValue) => void
}

export const RegisterForm = ({ error }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<FormValue>({
    defaultValues: { email: '', password: '', agree: false, confirmPassword: '', userName: '' },
    resolver: zodResolver(registerSchema)
  })
  console.log(errors)

  const onSubmit = (data: Props) => {
    console.log(data)
    reset()
  }

  return (
    <Card className={s.card} as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <h2>Sign Up</h2>
      <div className={s.containerBtn}>
        <Google />
        <Github />
      </div>
      <div className={s.containerInput}>
        <Input
          label={'User name'}
          type={'text'}
          id={'Username'}
          placeholder={'Epam11'}
          error={errors.userName?.message || error}
          {...register('userName')}
          className={s.inputCustom}
        />
      </div>
      <div className={s.containerInput}>
        <Input
          label={'Email'}
          type={'email'}
          id={'Email'}
          placeholder={'Epam@epam.com'}
          error={errors.email?.message}
          {...register('email')}
          className={s.inputCustom}
        />
      </div>
      <div className={s.containerInput}>
        <Input
          label={'Password'}
          type={'password'}
          id={'Password'}
          placeholder={'******************'}
          error={errors.password?.message}
          {...register('password')}
          className={s.inputCustom}
        />
      </div>
      <div className={s.containerInput}>
        <Input
          label={'Password Сonfirmation'}
          type={'password'}
          id={'confirmPassword'}
          placeholder={'******************'}
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
        <span>
          I agree to the <a href={'/'}>Terms of Service</a> and <a href={'./'}>Privacy Policy</a>
        </span>
      </div>
      <Button variant={'primary'} type="submit" className={s.buttonFoolWidth}>
        Sign Up
      </Button>
      <p>Do you have an account?</p>
      <Button variant={'textButton'}>Sign In</Button>
    </Card>
  )
}

export default RegisterForm
