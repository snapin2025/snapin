'use client'

import React from 'react'
import s from './spinner.module.css'

export const Spinner = () => {
  return (
    <>
      <div className={s.wrapper}>
        <span className={s.loader}></span>
      </div>
    </>
  )
}
