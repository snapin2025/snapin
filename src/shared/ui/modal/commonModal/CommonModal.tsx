'use client'
import s from './commonModal.module.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../Modal'
import { Close, Typography } from '@/shared/ui'
import React from 'react'

type CommonModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

export function CommonModal({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  className
}: CommonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className={className}>
        <DialogHeader className={s.headerWrapper}>
          <DialogTitle>
            <Typography variant={'h1'}>{title}</Typography>
          </DialogTitle>
          <DialogTrigger className={s.closeButton}>
            <Close className={s.size} />
          </DialogTrigger>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
