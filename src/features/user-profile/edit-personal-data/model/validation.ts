import { z } from 'zod'

export const editPersonalDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  aboutMe: z.string().optional()
})

export type EditPersonalDataFormValues = z.infer<typeof editPersonalDataSchema>
