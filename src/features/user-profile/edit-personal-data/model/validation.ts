import { z } from 'zod'

// model/validation.ts
export const editPersonalDataSchema = z.object({
  username: z.string().min(1, 'Username is required'), // ← добавляем
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  aboutMe: z.string().optional()
})

export type EditPersonalDataFormValues = z.infer<typeof editPersonalDataSchema>
