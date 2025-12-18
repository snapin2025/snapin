'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './EditPersonalData.module.css'
import { Button, Card, Input, Select, Textarea } from '@/shared/ui'
import { EditPersonalDataFormValues, editPersonalDataSchema } from '../model/validation'
import { useUpdatePersonalData } from '../api/use-update-personal-data'
import { PersonalDataRequest } from '../model/types'
import { InputDate } from '@/shared/ui/input-date/InputDate'

export const EditPersonalDataForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control
  } = useForm<EditPersonalDataFormValues>({
    resolver: zodResolver(editPersonalDataSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      region: '',
      aboutMe: ''
    }
  })

  const { mutate: updateProfile, isPending } = useUpdatePersonalData()

  const onSubmit = (data: EditPersonalDataFormValues) => {
    console.log(data)
    // Преобразуем дату из формата "dd.mm.yyyy" в ISO
    let isoDate = ''
    if (data.dateOfBirth) {
      const [day, month, year] = data.dateOfBirth.split('/')
      isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString()
    }

    // Данные для API
    const apiData: PersonalDataRequest = {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: isoDate,
      country: data.country || '',
      city: data.city || '',
      region: '',
      aboutMe: data.aboutMe || ''
    }

    // Отправляем
    updateProfile(apiData)
  }

  // ВРЕМЕННО (статический список)
  const countryOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'germany', label: 'Germany' },
    { value: 'france', label: 'France' },
    { value: 'uk', label: 'United Kingdom' }
  ]

  const cityOptions = [
    { value: 'ny', label: 'New York' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'paris', label: 'Paris' }
  ]

  return (
    <div className={s.container}>
      <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.formContent}>
          <div className={s.photoBox}></div>

          <div className={s.formFields}>
            <Input id="userName" type="text" value="Usertest" readOnly {...register('userName')} />
            {errors.userName && <span className={s.errorMessage}>{errors.userName.message}</span>}

            <Input
              id="firstName"
              label="First Name*"
              type="text"
              error={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && <span className={s.errorMessage}>{errors.firstName.message}</span>}

            <Input id="lastName" label="Last Name*" type="text" error={!!errors.lastName} {...register('lastName')} />
            {errors.lastName && <span className={s.errorMessage}>{errors.lastName.message}</span>}

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => <InputDate value={field.value} onChange={field.onChange} />}
            />

            {errors.dateOfBirth && <span className={s.errorMessage}>{errors.dateOfBirth.message}</span>}

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

            <Textarea
              label="About Me"
              placeholder="Text-area"
              {...register('aboutMe')}
              error={errors.aboutMe?.message}
              maxLength={500}
            />
          </div>
        </div>

        <hr className={s.hr} />

        <Button type="submit" variant="primary" className={s.buttonform} disabled={!isValid || isPending}>
          {isPending ? 'Saving' : 'Save Changes'}
        </Button>
      </Card>
    </div>
  )
}
