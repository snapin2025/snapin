'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './EditPersonalData.module.css'
import { Button, Input, Textarea, Select, Card, Calendar } from '@/shared/ui'
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
      username: '',
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
    <div className={s.container}>
      {/* Табы будут здесь */}
      {/* <Tabs className={s.tabs} /> */}

      <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.formContent}>
          {/* Левая колонка - квадрат для фото */}
          <div className={s.photoBox}></div>

          {/* Правая колонка - все поля формы */}
          <div className={s.formFields}>
            {/* Usertest - поле без лейбла, текст внутри */}
            <Input id="username" type="text" value="Usertest" readOnly {...register('username')} />
            {errors.username && <span className={s.errorMessage}>{errors.username.message}</span>}

            {/* First Name */}
            <Input
              id="firstName"
              label="First Name*"
              type="text"
              error={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && <span className={s.errorMessage}>{errors.firstName.message}</span>}

            {/* Last Name */}
            <Input id="lastName" label="Last Name*" type="text" error={!!errors.lastName} {...register('lastName')} />
            {errors.lastName && <span className={s.errorMessage}>{errors.lastName.message}</span>}

            {/* Date of Birth с иконкой календаря */}
            <div className={s.dateInputWrapper}>
              <Input
                id="dateOfBirth"
                label="Date of birth"
                type="text"
                placeholder="00.00.0000"
                {...register('dateOfBirth')}
              />
              <Calendar className={s.calendarIcon} />
            </div>

            {/* Селекты Country и City РЯДОМ */}
            <div className={s.selectsContainer}>
              <Select
                label="Select your country"
                options={countryOptions}
                value={watch('country')}
                onValueChange={(value) => setValue('country', value)}
              />

              <Select
                label="Select your city"
                options={cityOptions}
                value={watch('city')}
                onValueChange={(value) => setValue('city', value)}
              />
            </div>

            {/* About Me Textarea */}
            <Textarea label="About Me" {...register('aboutMe')} error={errors.aboutMe?.message} maxLength={500} />
          </div>
        </div>

        {/* Полоска-разделитель */}
        <hr className={s.hr} />

        {/* Save Button */}
        <Button type="submit" variant="primary" className={s.button} disabled={!isValid}>
          Save Changes
        </Button>
      </Card>
    </div>
  )
}
