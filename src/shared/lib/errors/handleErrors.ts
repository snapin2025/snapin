import { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import axios from 'axios'

export type ServerError = {
  statusCode: number
  messages:
    | string
    | Array<{
        message: string
        field: string
      }>
  error: string
}
type NormalizedMessage = {
  message: string
  field?: string
}
export type NormalizedServerError = {
  status?: number
  message: string
  fieldErrors: NormalizedMessage[]
  raw?: unknown
}

const capitalizeFirstLetter = (text: string): string => {
  if (!text) {
    return text
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}
/**
 * @example
 * try {
  await api.someRequest()
} catch (error) {
  const normalized = normalizeServerError(error)

  // показать глобальный toast
  toast(normalized.message, { type: 'error' })

  // при необходимости пробежать по fieldErrors и подсветить соответствующие поля
  normalized.fieldErrors.forEach(({ field, message }) => {
    console.log(`Ошибка в поле ${field}: ${message}`)
  })
}
 */

const DEFAULT_FALLBACK_MESSAGE = 'Произошла ошибка. Попробуйте позже.'

const getSafeString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }
  return undefined
}

const capitalizeSentence = (text: string): string => {
  if (!text) {
    return text
  }
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const normalizeMessageArray = (messages: ServerError['messages']): NormalizedMessage[] => {
  if (!Array.isArray(messages)) {
    return []
  }

  return messages
    .map((item) => {
      const message = getSafeString(item?.message)
      if (!message) {
        return null
      }

      const field = getSafeString(item?.field)
      return field ? { message, field } : { message }
    })
    .filter((item): item is NormalizedMessage => item !== null)
}

export const normalizeServerError = (
  error: unknown,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE
): NormalizedServerError => {
  const safeFallback = capitalizeSentence(fallbackMessage)

  if (!axios.isAxiosError<ServerError>(error) || !error.response) {
    const fallback = getSafeString((error as Error)?.message) ?? safeFallback

    return {
      message: capitalizeSentence(fallback),
      fieldErrors: [],
      raw: error
    }
  }

  const { status, data } = error.response
  const fieldErrors = normalizeMessageArray(data?.messages)

  const mergedFieldMessage = fieldErrors
    .map((item) => item.message)
    .filter(Boolean)
    .join('. ')

  const primaryMessage =
    mergedFieldMessage ||
    getSafeString(data?.messages as string | undefined) ||
    getSafeString(data?.error) ||
    safeFallback

  return {
    status,
    message: capitalizeSentence(primaryMessage),
    fieldErrors,
    raw: data
  }
}

/**
 * Универсальный обработчик ошибок форм
 *
 * @param error - Ошибка от Axios
 * @param setError - Функция установки ошибок из react-hook-form
 * @param defaultField - Поле по умолчанию для установки ошибки в поле формы (опционально, по умолчанию 'root')
 * @param fallbackMessage - Сообщение по умолчанию при неизвестной ошибке
 *
 * @example
 *
 * onError: (error) => handleFormErrors(error, setError)
 * onError: (error) => handleFormErrors(error, setError, 'password')
 * ``если ничего не передам в defaultField, и не будет ошибки с field то будет ошибка в поле root `{errors.root && (
        <div className="form-error">{errors.root.message}</div>
      )}
 */
export const handleFormErrors = <TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  defaultField?: Path<TFieldValues>,
  fallbackMessage = 'Произошла ошибка. Попробуйте позже.'
) => {
  const field = defaultField ?? ('root' as Path<TFieldValues>)

  if (!axios.isAxiosError<ServerError>(error) || !error.response?.data) {
    setError(field, { type: 'server', message: fallbackMessage })
    return
  }

  const { messages } = error.response.data
  let normalizedMessages: NormalizedMessage[] = []

  if (Array.isArray(messages)) {
    normalizedMessages = messages.map(({ message, field }) => ({
      message,
      field
    }))
  } else if (messages) {
    normalizedMessages = [{ message: messages }]
  }

  let hasFieldErrors = false

  normalizedMessages?.forEach(({ field, message }) => {
    if (!field) return
    setError(field as Path<TFieldValues>, {
      type: 'server',
      message: message || fallbackMessage
    })
    hasFieldErrors = true
  })

  if (!hasFieldErrors) {
    const aggregated = capitalizeFirstLetter(
      normalizedMessages
        ?.map(({ message }) => message)
        .filter(Boolean)
        .join('. ') || fallbackMessage
    )

    setError(field, { type: 'server', message: aggregated })
  }
}
