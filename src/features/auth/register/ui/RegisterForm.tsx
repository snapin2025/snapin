import { Card, Checkbox, Github, Google, Input } from '@/shared/ui'
import s from './RegisterForm.module.css'
import { Button } from '@/shared/ui/button/Button'
import { Controller, useForm } from 'react-hook-form'

type Props = {
  userName: string
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<Props>()

  const onSubmit = (data: Props) => {
    console.log(data)
  }

  return (
    <Card className={s.card} as="form" onSubmit={handleSubmit(onSubmit)}>
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
