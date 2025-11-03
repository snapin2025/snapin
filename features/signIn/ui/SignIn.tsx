'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Card } from '@/shared/ui'
import Link from 'next/link'
import { Input } from '@/shared/ui/input/input'
import { Button } from '@/shared/ui/button/Button'
import s from './signIn.module.css'
import { SignInFormTypes, signInSchema } from '../model/validation'
import { zodResolver } from '@hookform/resolvers/zod'
export const SignIn = () => {
  const {
    control,
    clearErrors,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInFormTypes>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit'
  })
  // const router = useRouter()

  // const [signInHandler] = useSignInMutation()
  // const [getMe] = useLazyMeQuery()

  const onSubmit = async (data: SignInFormTypes) => {
    // try {
    //   await signInHandler(data).unwrap()
    //   const currentUser = await getMe(undefined).unwrap()
    //
    //   if (currentUser?.id) {
    //     router.push(PATH.user_profile(currentUser.id))
    //   }
    // } catch (err) {
    //   handleFormError(err, setError, ['password'])
    // }
  }

  return (
    <Card className={s.card}>
      <div className={s.formWrapper}>
        <h2 className={s.title}>Sign In</h2>
        <div className={s.oAuth}></div>
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div className={s.fieldsWrapper}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  label={'Email'}
                  id={'email'}
                  placeholder={'Epam@epam.com'}
                  type={'email'}
                  error={errors.email?.message}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    clearErrors('email')
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  label={'Password'}
                  id={'password'}
                  placeholder={'**********'}
                  type={'password'}
                  error={errors.password?.message}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    clearErrors('password')
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          <div className={s.forgotLink}>
            <Link href={'/'}>Forgot Password</Link>
          </div>
          <div className={s.buttonWraper}>
            <Button className={s.full} variant="primary">
              Sign In
            </Button>
          </div>
          <div className={s.bottomText}>
            <div className={s.textContent}>
              <p>Don’t have an account?</p>
            </div>
            <div className={s.signUpLink}>
              <Link href={'/'}>Sign Up</Link>
            </div>
          </div>
        </form>
      </div>
    </Card>
  )
}
