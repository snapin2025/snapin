'use client'

import React, { ReactNode, useState } from 'react'
import s from './input.module.css'
import clsx from 'clsx'
import { Close, Eye, EyeOff, Search, Typography } from '@/shared/ui'

type InputProps = {
  placeholder?: string
  type: 'email' | 'password' | 'search' | 'text'
  id: string
  label?: string | ReactNode
  error?: string
  isDisabled?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onClear?: () => void
  name?: string
  className?: string
  autoComplete?: string
  ref?: React.RefObject<HTMLInputElement>
}

export const Input = ({
  placeholder,
  type,
  id,
  label,
  error,
  isDisabled,
  value,
  onChange,
  onBlur,
  onClear,
  name,
  className,
  autoComplete,
  ref
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const inputClassName = clsx(
    error ? s.errorInput : s.defaultInput,
    type === 'search' && s.searchInput,
    type === 'password' && s.passwordInput,
    className
  )
  const labelClassName = clsx(s.label, isDisabled && s.labelDisabled)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const handleClear = () => {
    if (onClear) {
      onClear()
    }
  }

  return (
    <div>
      {label && (
        <Typography variant={'regular_14'} color={'dark'} asChild>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        </Typography>
      )}
      <div className={s.wrapper}>
        {type === 'search' && (
          <span className={s.searchIcon}>
            <Search />
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={inputClassName}
          disabled={isDisabled}
          autoComplete={autoComplete}
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
        />

        {type === 'password' && (
          <button
            type="button"
            className={s.eyesIcon}
            onClick={() => setShowPassword(!showPassword)}
            disabled={isDisabled}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        )}

        {type === 'search' && value && (
          <button
            type="button"
            className={s.crossIcon}
            onClick={handleClear}
            disabled={isDisabled}
            tabIndex={-1}
            aria-label="Clear input"
          >
            <Close />
          </button>
        )}
      </div>
      {error && (
        <Typography variant={'regular_14'} color={'error'} asChild>
          <span className={s.errorText}>{error}</span>
        </Typography>
      )}
    </div>
  )
}
