// Просто форматирование, без валидации
export const formatSubscriptionDate = (isoString: string): string => {
  // из "2026-01-04T11:11:52.422Z" → "04.01.2026"
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
