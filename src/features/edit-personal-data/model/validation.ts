// import { z } from 'zod'

// model/validation.ts
// export const editPersonalDataSchema = z.object({
//   userName: z.string().min(1, 'UserName is required'),
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   dateOfBirth: z
//     .string()
//     .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in format dd/mm/yyyy') // ← добавлена валидация формата
//     .optional(),
//   country: z.string().optional(),
//   city: z.string().optional(),
//   region: z.string().optional(), // есть в свагере, но не в UI
//   aboutMe: z
//     .string()
//     .max(500, 'About me cannot exceed 500 characters') // ← добавлено ограничение
//     .optional()
// })
//
// export type EditPersonalDataFormValues = z.infer<typeof editPersonalDataSchema>
import { z } from 'zod'

export const editPersonalDataSchema = z.object({
  userName: z.string().min(1, 'UserName is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in format MM/dd/yyyy')
    .optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  aboutMe: z.string().max(500, 'About me cannot exceed 500 characters').optional()
})

export type EditPersonalDataFormValues = z.infer<typeof editPersonalDataSchema>
