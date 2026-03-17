// валидация  для написания  коментарий к посту
import { z } from 'zod'

//  Только то, что в ТЗ: длина от 1 до 300 символов
export const CommentSchema = z.object({
  content: z.string().min(1, 'Comment must be at least 1 character').max(300, 'Comment must not exceed 300 characters')
})
