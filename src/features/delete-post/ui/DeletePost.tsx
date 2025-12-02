import React from 'react'
import { Button, TrashOutline, Typography } from '@/shared/ui'
import { AlertAction, AlertCancel, AlertDescription, AlertDialog } from '@/shared/ui/alert-dilog'
import s from './DeletePost.module.css'

export const DeletePost = () => {
  return (
    <>
      <AlertDialog
        title={'Logout'}
        trigger={
          <Button variant={'textButton'} className={s.trigger}>
            <TrashOutline />
            <Typography>Delete Post</Typography>
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'center',
            gap: '18px'
          }}
        >
          <>
            <AlertDescription asChild style={{ textAlign: 'left', width: '100%' }}>
              <Typography variant={'regular_16'}>Are you sure to want logout?</Typography>
            </AlertDescription>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '24px' }}>
              <AlertAction asChild>
                <Button variant={'outlined'}>Ok</Button>
              </AlertAction>
              <AlertCancel asChild>
                <Button style={{ minWidth: '96px' }}>Cancel</Button>
              </AlertCancel>
            </div>
          </>
        </div>
      </AlertDialog>
    </>
  )
}
