import { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { AxiosError } from 'axios'

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

/**
* @example
 *  catch (error) {
 *   const message = extractErrorMessage(error)
 */

export const extractErrorMessage = (
  error: unknown,
  fallbackMessage = 'Произошла ошибка. Попробуйте позже.'
): string => {
  const axiosError = error as AxiosError<ServerError>
  const serverError = axiosError.response?.data

  // Если нет данных от сервера
  if (!serverError?.messages) {
    return fallbackMessage
  }

  // Если messages — это строка
  if (typeof serverError.messages === 'string') {
    return serverError.messages
  }

  // Если массив — склеиваем все сообщения
  const messages = serverError.messages.map((item) => item.message).join('. ')
  return messages || fallbackMessage
}

/**
 * Универсальный обработчик ошибок форм
 *
 * @param error - Ошибка от Axios
 * @param setError - Функция установки ошибок из react-hook-form
 * @param defaultField - Поле по умолчанию для установки ошибки в поле формы
 *
 * @example
 * 
 * onError: (error) => handleFormErrors(error, setError, 'password')
 * ```
 */
export const handleFormErrors = <TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  defaultField: Path<TFieldValues> = 'password' as Path<TFieldValues>
) => {
  const message = extractErrorMessage(error)
  setError(defaultField, {
    type: 'server',
    message
  })
}
