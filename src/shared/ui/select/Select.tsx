'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import styles from './Select.module.css'
import { Arrow } from '@/shared/ui'
import { ComponentPropsWithoutRef } from 'react'

type Option = { value: string; label: string }

type SelectProps = {
  placeholder?: string
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  label?: string // ← Лейбл сверху
} & ComponentPropsWithoutRef<typeof SelectPrimitive.Root>

export const Select = ({ placeholder = 'Select', options, value, onValueChange, label, ...props }: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      {/* ← Обёртка для лейбла */}
      {label && <label className={styles.label}>{label}</label>} {/* ← Показываем лейбл если есть */}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
        <SelectPrimitive.Trigger className={styles.trigger}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <Arrow className={styles.icon} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={styles.content}>
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item key={option.value} value={option.value} className={styles.item}>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
