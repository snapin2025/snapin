// 'use client'
//
// import Image from 'next/image'
// import { useState } from 'react'
// import { Dialog, DialogClose } from '@/shared/ui/temp/dialog' // ← ДОБАВИЛ DialogClose
// import { Textarea } from '@/shared/ui/textarea'
// import { PostCard } from '@/shared/ui/post'
// import { Card } from '@/shared/ui'
// import s from './EditPostForm.module.css'
// import { Button } from '@/shared/ui/button/Button'
// import { useEditPost } from '../api/use-edit-post'
//
// export type EditPostFormProps = {
//   isOpen: boolean
//   onClose: () => void
//   postId: number
//   userName: string
//   userAvatar: string
//   postImage: string
//   initialDescription: string
//   onSave?: (description: string) => Promise<void>
// }
//
// export const EditPostForm = ({
//   isOpen,
//   onClose,
//   postId,
//   userName,
//   userAvatar,
//   postImage,
//   initialDescription
// }: EditPostFormProps) => {
//   const [description, setDescription] = useState(initialDescription || '')
//   const { mutateAsync: editPost, isPending: isSaving } = useEditPost()
//   const [showCloseConfirm, setShowCloseConfirm] = useState(false) // ← ДОБАВИЛ: состояние подтверждения
//
//   const hasChanges = description !== initialDescription // ← ДОБАВИЛ: проверка изменений
//
//   const handleDialogClose = (open: boolean) => {
//     // ← ДОБАВИЛ: обработчик закрытия
//     if (!open) {
//       if (hasChanges && !isSaving) {
//         setShowCloseConfirm(true) // показать подтверждение
//         return
//       } else {
//         onClose() // закрыть если нет изменений
//       }
//     }
//   }
//
//   const handleSave = async () => {
//     try {
//       await editPost({ postId, description })
//       onClose()
//     } catch (error) {
//       console.error('Failed to save post:', error)
//     }
//   }
//
//   return (
//     <Dialog title="Edit Post" open={isOpen} onOpenChange={handleDialogClose} className={s.dialog}>
//       <Card className={s.wrapper}>
//         {showCloseConfirm ? ( // ← ДОБАВИЛ: если нужно подтверждение
//           <div className={s.confirmContent}>
//             <p className={s.confirmText}>
//               Do you really want to finish editing? If you close the changes you have made will not be saved
//             </p>
//             <div className={s.confirmButtons}>
//               <DialogClose asChild>
//                 <Button variant="outlined" onClick={onClose}>
//                   Yes
//                 </Button>
//               </DialogClose>
//
//               <DialogClose asChild>
//                 <Button onClick={() => setShowCloseConfirm(false)}>No</Button>
//               </DialogClose>
//             </div>
//           </div>
//         ) : (
//           // ← обычная форма редактирования
//           <>
//             <div className={s.imgBox}>
//               <Image src={postImage} alt="Post" width={490} height={503} className={s.img} />
//             </div>
//
//             <div className={s.form}>
//               <PostCard userName={userName} avatar={userAvatar} className={s.post} />
//               <Textarea
//                 label="Add publication descriptions"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 maxLength={500}
//               />
//
//               <div className={s.counter}>{description?.length || 0}/500</div>
//
//               <Button variant="primary" className={s.button} onClick={handleSave} disabled={isSaving || !hasChanges}>
//                 {isSaving ? 'Saving' : 'Save Changes'}
//               </Button>
//             </div>
//           </>
//         )}
//       </Card>
//     </Dialog>
//   )
// }
//форма 2
//форма 3
// 'use client'
//
// import Image from 'next/image'
// import { useState } from 'react'
// import { Dialog, DialogClose } from '@/shared/ui/temp/dialog'
// import { Textarea } from '@/shared/ui/textarea'
// import { PostCard } from '@/shared/ui/post'
// import { Card } from '@/shared/ui'
// import s from './EditPostForm.module.css'
// import { Button } from '@/shared/ui/button/Button'
// import { useEditPost } from '../api/use-edit-post'
//
// export type EditPostFormProps = {
//   isOpen: boolean
//   onClose: () => void
//   postId: number
//   userName: string
//   userAvatar: string
//   postImage: string
//   initialDescription: string
//   onSave?: (description: string) => Promise<void>
// }
//
// export const EditPostForm = ({
//   isOpen,
//   onClose,
//   postId,
//   userName,
//   userAvatar,
//   postImage,
//   initialDescription
// }: EditPostFormProps) => {
//   const [description, setDescription] = useState(initialDescription || '')
//   const { mutateAsync: editPost, isPending: isSaving } = useEditPost()
//   const [showCloseConfirm, setShowCloseConfirm] = useState(false)
//
//   const hasChanges = description !== initialDescription
//
//   const handleDialogClose = (open: boolean) => {
//     if (!open) {
//       if (hasChanges && !isSaving) {
//         setShowCloseConfirm(true) // показываем confirm окно
//         return false // НЕ закрываем основное окно
//       } else {
//         onClose() // закрываем если нет изменений
//       }
//     }
//     return true
//   }
//
//   const handleSave = async () => {
//     try {
//       await editPost({ postId, description })
//       onClose()
//     } catch (error) {
//       console.error('Failed to save post:', error)
//     }
//   }
//
//   return (
//     <>
//       {/* Основное окно редактирования */}
//       <Dialog title="Edit Post" open={isOpen} onOpenChange={handleDialogClose} className={s.dialog}>
//         <Card className={s.wrapper}>
//           <div className={s.imgBox}>
//             <Image src={postImage} alt="Post" width={490} height={503} className={s.img} />
//           </div>
//
//           <div className={s.form}>
//             <PostCard userName={userName} avatar={userAvatar} className={s.post} />
//             <Textarea
//               label="Add publication descriptions"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               maxLength={500}
//             />
//             <div className={s.counter}>{description?.length || 0}/500</div>
//
//             <Button variant="primary" className={s.button} onClick={handleSave} disabled={isSaving || !hasChanges}>
//               {isSaving ? 'Saving' : 'Save Changes'}
//             </Button>
//           </div>
//         </Card>
//       </Dialog>
//
//       {/* Confirm окно - маленькое диалоговое окно поверх основного */}
//       <Dialog
//         title="Close Post"
//         open={showCloseConfirm}
//         onOpenChange={(open) => !open && setShowCloseConfirm(false)}
//         className={s.confirmDialog}
//       >
//         <div className={s.confirmContent}>
//           <p className={s.confirmText}>
//             Do you really want to finish editing? If you close the changes you have made will not be saved
//           </p>
//           <div className={s.confirmButtons}>
//             <DialogClose asChild>
//               <Button variant="outlined" onClick={onClose}>
//                 Yes
//               </Button>
//             </DialogClose>
//             {/* Кнопка No просто закрывает confirm окно, не трогая основное */}
//             <Button onClick={() => setShowCloseConfirm(false)}>No</Button>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   )
// }
//4
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogClose } from '@/shared/ui/temp/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { PostCard } from '@/shared/ui/post'
import { Card } from '@/shared/ui'
import s from './EditPostForm.module.css'
import { Button } from '@/shared/ui/button/Button'
import { useEditPost } from '../api/use-edit-post'

export type EditPostFormProps = {
  isOpen: boolean
  onClose: () => void
  postId: number
  userName: string
  userAvatar: string
  postImage: string
  initialDescription: string
  onSave?: (description: string) => Promise<void>
}

export const EditPostForm = ({
  isOpen,
  onClose,
  postId,
  userName,
  userAvatar,
  postImage,
  initialDescription
}: EditPostFormProps) => {
  const [description, setDescription] = useState(initialDescription || '')
  const { mutateAsync: editPost, isPending: isSaving } = useEditPost()
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  // const hasChanges = description !== initialDescription

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // if (hasChanges && !isSaving) {
      if (description !== initialDescription && !isSaving) {
        setShowCloseConfirm(true) // показываем confirm окно
        return false // НЕ закрываем основное окно
      } else {
        onClose() // закрываем если нет изменений
      }
    }
    return true
  }

  // const handleSave = async () => {
  //   try {
  //     await editPost({ postId, description })
  //     onClose()
  //   } catch (error) {
  //     console.error('Failed to save post:', error)
  //   }
  // }
  const handleSave = async () => {
    // Если нет изменений, просто закрываем
    if (description === initialDescription) {
      onClose()
      return
    }

    try {
      await editPost({ postId, description })
      onClose()
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  return (
    <>
      {/* Основное окно редактирования */}
      <Dialog title="Edit Post" open={isOpen} onOpenChange={handleDialogClose} className={s.dialog}>
        <Card className={s.wrapper}>
          <div className={s.imgBox}>
            <Image src={postImage} alt="Post" width={490} height={503} className={s.img} />
          </div>

          <div className={s.form}>
            <PostCard userName={userName} avatar={userAvatar} className={s.post} />
            <Textarea
              label="Add publication descriptions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <div className={s.counter}>{description?.length || 0}/500</div>

            <Button variant="primary" className={s.button} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </Dialog>

      {/* Confirm окно - маленькое диалоговое окно поверх основного */}
      {showCloseConfirm && ( // ← ОБЕРНУЛ В УСЛОВИЕ showCloseConfirm
        <>
          {/* 1. Кастомный overlay (полупрозрачная шторка на весь экран) */}
          {/*<div className={s.confirmGlobalOverlay} />*/}

          {/* 2. Confirm Dialog (окно с вопросом) */}
          <Dialog
            title="Close Post"
            open={showCloseConfirm}
            onOpenChange={(open) => !open && setShowCloseConfirm(false)}
            className={s.confirmDialog}
          >
            <div className={s.confirmContent}>
              <p className={s.confirmText}>
                Do you really want to finish editing? If you close the changes you have made will not be saved
              </p>
              <div className={s.confirmButtons}>
                <DialogClose asChild>
                  <Button variant="outlined" onClick={onClose} className={s.buttoninfo}>
                    Yes
                  </Button>
                </DialogClose>
                {/* Кнопка No просто закрывает confirm окно, не трогая основное */}
                <Button className={s.buttoninfo} onClick={() => setShowCloseConfirm(false)}>
                  No
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </>
  )
}
