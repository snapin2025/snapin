// Типы для запроса/ответа API
export type PersonalDataRequest = {
  userName: string
  firstName: string
  lastName: string
  dateOfBirth: string // ISO format надо будет  изменить так как пидетв таком виде  00-00-0000
  country: string
  city: string
  region: string
  aboutMe: string
}
