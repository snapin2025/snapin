import { z } from 'zod'

// ✔ Схема для формы с капчей
export const inputEmailSchema = z.object({
  email: z.string().email('Incorrect email address'),
  recaptcha: z.string()
})

// ✔ Схема для формы без капчи (только email) — используем pick
export const emailOnlySchema = inputEmailSchema.pick({ email: true })

// ✔ Типы
export type ForgotPasswordInputs = z.infer<typeof inputEmailSchema>
export type EmailOnlyInputs = z.infer<typeof emailOnlySchema>
