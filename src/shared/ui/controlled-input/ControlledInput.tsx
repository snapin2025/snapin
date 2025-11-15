import React from 'react'
import { Input } from '@/shared/ui'
import { InputProps } from '@/shared/ui/input'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

type ControlledInputProps<T extends FieldValues> = Omit<InputProps, 'value' | 'onChange' | 'id'> & UseControllerProps<T>

export const ControlledInput = <T extends FieldValues>(props: ControlledInputProps<T>) => {
  const { control, defaultValue, name, rules, shouldUnregister, ...rest } = props
  const {
    field: { onChange, value, onBlur }
  } = useController({
    control,
    defaultValue,
    name,
    rules,
    shouldUnregister
  })
  return <Input id={name} onBlur={onBlur} onChange={onChange} value={value} {...rest} />
}
