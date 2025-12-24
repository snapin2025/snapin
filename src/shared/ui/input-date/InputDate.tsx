import { DateRange, DayPicker } from 'react-day-picker'
import { Calendar, Card, Input, Typography } from '@/shared/ui'
import { format, isSameDay, isValid, parse } from 'date-fns'
import { ChangeEvent, HTMLAttributes, useEffect, useState } from 'react'
import classNames from 'react-day-picker/style.module.css'
import s from './InputDate.module.css'

type InputDateProps = {
  value?: string
  onChange?: (value: string) => void
  error: boolean
}

export const InputDate = ({ value, onChange, error }: InputDateProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)
  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date())
  // Hold the selected date in state
  const [range, setRange] = useState<DateRange | undefined>()
  // Hold the input value in state
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!value) {
      setInputValue('')
      setRange(undefined)
      return
    }

    setInputValue(value)

    if (!value.includes('-')) {
      const date = parse(value, 'MM/dd/yyyy', new Date())
      if (isValid(date)) {
        setRange({ from: date, to: date })
        setMonth(date)
      }
    }
  }, [value])

  const handleDayPickerSelect = (range: DateRange | undefined) => {
    setRange(range)

    const formatted = formatRange(range)
    setInputValue(formatted)
    onChange?.(formatted)

    if (range?.from) {
      setMonth(range.from)
    }
  }

  /** Ввод диапазона вручную */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onChange?.(value)

    if (!value.includes('-')) {
      const from = parse(value, 'MM/dd/yyyy', new Date())
      if (isValid(from)) {
        setRange({ from, to: from })
        setMonth(from)
      }
      return
    }

    const [fromStr, toStr] = value.split(' - ')
    const from = parse(fromStr, 'MM/dd/yyyy', new Date())
    const to = parse(toStr, 'MM/dd/yyyy', new Date())

    if (isValid(from) && isValid(to)) {
      setRange({ from, to })
      setMonth(from)
    }
  }

  const modifiers = {
    weekend: { dayOfWeek: [0, 6] } // 0 = воскресенье, 6 = суббота
  }
  return (
    <>
      <div className={s.dateInputWrapper}>
        <Input
          id="dateOfBirth"
          label="Date of birth"
          type="text"
          placeholder="mm/dd/yyyy"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Calendar className={s.calendarIcon} onClick={() => setIsCalendarOpen((prevState) => !prevState)} />
        {isCalendarOpen && (
          <Card className={s.card}>
            <DayPicker
              month={month}
              onMonthChange={setMonth}
              selected={range}
              onSelect={handleDayPickerSelect}
              components={{
                CaptionLabel: CaptionMonth
              }}
              classNames={{
                ...classNames,
                chevron: s.chevron,
                button_next: s.navBtn,
                button_previous: s.navBtn,
                today: s.today,
                outside: s.outside,
                day: s.day,
                weekday: s.weekday,
                weekdays: s.weekdays,
                selected: s.selected,
                range_end: s.rangeEnd,
                range_start: s.rangeStart,
                range_middle: s.rangeMiddle
              }}
              ISOWeek
              showOutsideDays
              modifiers={modifiers}
              modifiersClassNames={{
                weekend: s.weekend
              }}
              mode={'range'}
            />
          </Card>
        )}
      </div>
    </>
  )
}

const CaptionMonth = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Typography asChild variant={'bold_16'}>
      <span {...props}></span>
    </Typography>
  )
}

function formatRange(range?: DateRange) {
  if (!range?.from) return ''

  // from === to → одна дата
  if (range.to && isSameDay(range.from, range.to)) {
    return format(range.from, 'MM/dd/yyyy')
  }

  // только from
  if (!range.to) {
    return format(range.from, 'MM/dd/yyyy')
  }

  // полноценный диапазон
  return `${format(range.from, 'MM/dd/yyyy')} - ${format(range.to, 'MM/dd/yyyy')}`
}
