import { z } from 'zod'

export const inputEmailSchema = z.object({
  email: z.string().email('Incorrect email address'),
  recaptcha: z.string()
})
export type ForgotPasswordInputs = z.infer<typeof inputEmailSchema>
