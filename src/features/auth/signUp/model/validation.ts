import { z } from 'zod/v4'

export type SignUpForm = z.infer<typeof SignUpSchema>

export const SignUpSchema = z.object({
  userName: z.string().min(1, 'User name is required').max(30, 'Maximum number of characters 30'),
  email: z.email('The email must match the format example@example.com'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/,
      'Password must contain a-z, A-Z, and at least one special character'
    ),
  confirmPassword: z.string().min(6, 'Password confirmation is required'),
  agree: z.boolean()
})
