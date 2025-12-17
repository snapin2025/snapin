export const MAX_PROFILE_PHOTO_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png'] as const

export type FileValidationError = {
  message: string
  fileName?: string
}

export type FileValidationResult = {
  valid: boolean
  errors: FileValidationError[]
}

export const validateProfilePhoto = (file: File): FileValidationResult => {
  const errors: FileValidationError[] = []

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    errors.push({
      message: 'Only JPEG and PNG formats are supported.',
      fileName: file.name
    })
  }

  if (file.size > MAX_PROFILE_PHOTO_SIZE) {
    errors.push({
      message: `"${file.name}" exceeds the 10MB limit.`,
      fileName: file.name
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}