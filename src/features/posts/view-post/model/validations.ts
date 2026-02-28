//валидация  для лайков
// validation.ts
import { z } from 'zod'

export const LikeStatusSchema = z.union([z.literal('LIKE'), z.literal('NONE')])
