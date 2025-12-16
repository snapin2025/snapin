'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './editPersonalData.module.css'
import { Button, Input, Textarea, Select, Card } from '@/shared/ui'
import { editPersonalDataSchema, EditPersonalDataFormValues } from './model/validation'

export const EditPersonalDataForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<EditPersonalDataFormValues>({
    resolver: zodResolver(editPersonalDataSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      aboutMe: ''
    }
  })

  const onSubmit = (data: EditPersonalDataFormValues) => {
    console.log('Form data:', data)
  }

  const countryOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'uk', label: 'UK' },
    { value: 'germany', label: 'Germany' }
  ]

  const cityOptions = [
    { value: 'new-york', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'berlin', label: 'Berlin' }
  ]

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      {/* Просто квадрат для фото */}
      <div className={s.photoBox}></div>

      {/* First Name */}
      <div className={s.field}>
        <Input id="firstName" label="First Name*" type="text" error={!!errors.firstName} {...register('firstName')} />
        {errors.firstName && <span className={s.errorMessage}>{errors.firstName.message}</span>}
      </div>

      {/* Last Name */}
      <div className={s.field}>
        <Input id="lastName" label="Last Name*" type="text" error={!!errors.lastName} {...register('lastName')} />
        {errors.lastName && <span className={s.errorMessage}>{errors.lastName.message}</span>}
      </div>

      {/* Date of Birth - БЕЗ ВАЛИДАЦИИ, будет календарь */}
      <div className={s.field}>
        <Input
          id="dateOfBirth"
          label="Date of birth"
          type="text"
          placeholder="00.00.0000"
          {...register('dateOfBirth')}
        />
        {/* Убираем вывод ошибок для даты */}
      </div>

      {/* Country Select */}
      <div className={s.field}>
        <Select
          label="Select your country"
          options={countryOptions}
          value={watch('country')}
          onValueChange={(value) => setValue('country', value)}
        />
      </div>

      {/* City Select */}
      <div className={s.field}>
        <Select
          label="Select your city"
          options={cityOptions}
          value={watch('city')}
          onValueChange={(value) => setValue('city', value)}
        />
      </div>

      {/* About Me Textarea */}
      <div className={s.field}>
        <Textarea label="About Me" {...register('aboutMe')} error={errors.aboutMe?.message} maxLength={500} />
      </div>

      {/* Save Button */}
      <Button type="submit" variant="primary" className={s.button} disabled={!isValid}>
        Save Changes
      </Button>
    </Card>
  )
}
