import { z } from 'zod'

export type SignInFormTypes = z.infer<typeof signInSchema>

export const PASSWORD =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/

export const signInSchema = z.object({
  email: z.string().min(1, { message: 'This field has to be filled.' }).email('This is not a valid email.'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).regex(PASSWORD, {
    message:
      'Password must include at least one uppercase latin letter, one lowercase latin letter, one number, and one special character.'
  })
})
