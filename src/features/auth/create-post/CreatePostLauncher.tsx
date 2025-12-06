'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { CreatePostDialog } from '@/features/auth/create-post/ui/CreatePostDialog'

export const CreatePostLauncher = () => {
  const [openAdd, setOpenAdd] = useState(false)

  const handleFile = (file: File) => {
    console.log('Selected file:', file)
    // тут позже откроем CroppingDialog
  }

  return (
    <>
      <Button onClick={() => setOpenAdd(true)}>Create</Button>

      <CreatePostDialog open={openAdd} onOpenChange={setOpenAdd} onFileSelect={handleFile} />
    </>
  )
}
