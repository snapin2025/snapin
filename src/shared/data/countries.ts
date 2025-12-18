// shared/data/countries.ts

// Тип для элемента списка (совпадает с тем, что ожидает Select)
export type LocationOption = {
  value: string
  label: string
}

// Основной список стран
export const COUNTRIES: LocationOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'RU', label: 'Russia' },
  { value: 'JP', label: 'Japan' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' }
]

// Города, сгруппированные по коду страны
export const CITIES_BY_COUNTRY: Record<string, LocationOption[]> = {
  US: [
    { value: 'new_york', label: 'New York' },
    { value: 'los_angeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    { value: 'miami', label: 'Miami' }
  ],
  RU: [
    { value: 'moscow', label: 'Moscow' },
    { value: 'saint_petersburg', label: 'Saint Petersburg' },
    { value: 'kazan', label: 'Kazan' },
    { value: 'novosibirsk', label: 'Novosibirsk' },
    { value: 'yekaterinburg', label: 'Yekaterinburg' }
  ],
  DE: [
    { value: 'berlin', label: 'Berlin' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'munich', label: 'Munich' },
    { value: 'cologne', label: 'Cologne' },
    { value: 'frankfurt', label: 'Frankfurt' }
  ],
  GB: [
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'liverpool', label: 'Liverpool' },
    { value: 'edinburgh', label: 'Edinburgh' }
  ]
}

// Вспомогательная функция: получить города по коду страны
export const getCitiesByCountry = (countryCode: string): LocationOption[] => {
  return CITIES_BY_COUNTRY[countryCode] || []
}
