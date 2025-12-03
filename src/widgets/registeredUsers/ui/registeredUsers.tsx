'use client'

import { useTotalCountUsers } from '../api/useTotalCountUsers'
import styles from './registeredUusers.module.css'
import { Typography } from '@/shared/ui/typography/Typography'

const formatNumberToDigits = (num: number): string[] => {
  const numStr = num.toString()
  const digits = numStr.split('')
  
  // Если число меньше 6 цифр, добавляем нули в начало
  while (digits.length < 6) {
    digits.unshift('0')
  }
  
  return digits.slice(0, 6)
}

export const RegisteredUsers = () => {
  const { data, isLoading, isError } = useTotalCountUsers()

  const digits = data?.totalCount ? formatNumberToDigits(data.totalCount) : ['0', '0', '0', '0', '0', '0']

  return (
  <div className={styles.registredContainer}>
    <Typography variant="h2">Registered users:</Typography>
    <div className={styles.numberContainer}>
      <ul>
          {digits.map((digit, index) => (
            <li key={index}>{digit}</li>
          ))}
      </ul>
    </div>
  </div>
)
}
