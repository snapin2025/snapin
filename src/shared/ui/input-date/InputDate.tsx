import { DayPicker } from 'react-day-picker'
import { Card, Typography } from '@/shared/ui'
import classNames from 'react-day-picker/style.module.css'
import s from './InputDate.module.css'
import { HTMLAttributes } from 'react'

console.log(classNames)

export const InputDate = () => {
  const modifiers = {
    weekend: { dayOfWeek: [0, 6] } // 0 = воскресенье, 6 = суббота
  }
  return (
    <Card className={s.card}>
      <DayPicker
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
          weekdays: s.weekdays
        }}
        ISOWeek
        showOutsideDays
        modifiers={modifiers}
        modifiersClassNames={{
          weekend: s.weekend
        }}
      />
    </Card>
  )
}

const CaptionMonth = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Typography asChild variant={'bold_16'}>
      <span {...props}></span>
    </Typography>
  )
}
