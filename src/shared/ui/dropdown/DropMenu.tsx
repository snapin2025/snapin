// 'use client'
//
// import { useState } from 'react'
// import { Dropdown } from './Dropdown'
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
// import s from './Dropdown.module.css'
// import { DeleteIcon, DotsIcon, EditIcon, FollowIcon, UnfollowIcon } from '@/shared/ui'
// import { useAuth } from '@/shared/lib'
//
// type DropMenuProps = {
//   onEdit?: () => void
//   onDelete?: () => void
//   onFollow?: () => void
//   onUnfollow?: () => void
//   onCopyLink?: () => void
//   ownerId: number
//   currentUserId?: number | null
//   isFollowing?: boolean | null
//   isFollowPending?: boolean
// }
//
// export const DropMenu = ({
//   onEdit,
//   onDelete,
//   onFollow,
//   onUnfollow,
//   ownerId,
//   currentUserId,
//   isFollowing = null,
//   isFollowPending = false
// }: DropMenuProps) => {
//   const [open, setOpen] = useState(false)
//
//   const { user } = useAuth()
//
//   // Показываем Edit/Delete только если это пост текущего пользователя
//   const canEdit = !!currentUserId && currentUserId === ownerId
//   // Показываем Follow/Unfollow только если пользователь авторизован и это не его пост
//   const canFollow = !!user && !!currentUserId && currentUserId !== ownerId
//
//   const myTrigger = (
//     // обертка
//
//     <button type="button" className={s.IconButton} aria-label="Post options">
//       {/*три точки*/}
//       <DotsIcon className={s.dots} />
//     </button>
//   )
//
//   return (
//     <Dropdown trigger={myTrigger} align="end" open={open} onOpenChange={setOpen}>
//       {canEdit && (
//         <>
//           <DropdownMenu.Item
//             className={s.DropdownMenuItem}
//             onSelect={(event) => {
//               event.preventDefault()
//               setOpen(false)
//               onEdit?.()
//             }}
//           >
//             <EditIcon className={s.icon} />
//             Edit Post
//           </DropdownMenu.Item>
//
//           <DropdownMenu.Item
//             className={s.DropdownMenuItem}
//             onSelect={(event) => {
//               event.preventDefault()
//               setOpen(false)
//               onDelete?.()
//             }}
//           >
//             <DeleteIcon className={s.icon} />
//             Delete Post
//           </DropdownMenu.Item>
//         </>
//       )}
//
//       {canFollow && (
//         <>
//           <DropdownMenu.Item
//             className={s.DropdownMenuItem}
//             disabled={isFollowPending || isFollowing === null}
//             onSelect={(event) => {
//               event.preventDefault()
//               setOpen(false)
//               if (isFollowing === null) {
//                 return
//               }
//
//               if (isFollowing) {
//                 onUnfollow?.()
//                 return
//               }
//
//               onFollow?.()
//             }}
//           >
//             {isFollowing ? <UnfollowIcon className={s.icon} /> : <FollowIcon className={s.icon} />}
//             {isFollowing === null ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
//           </DropdownMenu.Item>
//         </>
//       )}
//     </Dropdown>
//   )
// }
//
// export default DropMenu

'use client'

import { useState } from 'react'
import { Dropdown } from './Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import s from './Dropdown.module.css'
import { CopyLinkIcon, DeleteIcon, DotsIcon, EditIcon, FollowIcon, UnfollowIcon } from '@/shared/ui'
import { useAuth } from '@/shared/lib'

type DropMenuProps = {
  onEdit?: () => void
  onDelete?: () => void
  onFollow?: () => void
  onUnfollow?: () => void
  onCopyLink?: () => void
  ownerId: number
  currentUserId?: number | null
  isFollowing?: boolean | null
  isFollowPending?: boolean
}

export const DropMenu = ({
  onEdit,
  onDelete,
  onFollow,
  onUnfollow,
  onCopyLink,
  ownerId,
  currentUserId,
  isFollowing = null,
  isFollowPending = false
}: DropMenuProps) => {
  const [open, setOpen] = useState(false)

  const { user } = useAuth()

  const canEdit = !!currentUserId && currentUserId === ownerId
  const canFollow = !!user && !!currentUserId && currentUserId !== ownerId

  const myTrigger = (
    <button type="button" className={s.IconButton} aria-label="Post options">
      <DotsIcon className={s.dots} />
    </button>
  )

  return (
    <Dropdown trigger={myTrigger} align="end" open={open} onOpenChange={setOpen}>
      {canEdit && (
        <>
          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onEdit?.()
            }}
          >
            <EditIcon className={s.icon} />
            Edit Post
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={s.DropdownMenuItem}
            onSelect={(event) => {
              event.preventDefault()
              setOpen(false)
              onDelete?.()
            }}
          >
            <DeleteIcon className={s.icon} />
            Delete Post
          </DropdownMenu.Item>
        </>
      )}

      {canFollow && (
        <DropdownMenu.Item
          className={s.DropdownMenuItem}
          disabled={isFollowPending || isFollowing === null}
          onSelect={(event) => {
            event.preventDefault()
            setOpen(false)
            if (isFollowing === null) return
            isFollowing ? onUnfollow?.() : onFollow?.()
          }}
        >
          {isFollowing === null ? (
            'Loading...'
          ) : isFollowing ? (
            <>
              <UnfollowIcon className={s.icon} />
              Unfollow
            </>
          ) : (
            <>
              <FollowIcon className={s.icon} />
              Follow
            </>
          )}
        </DropdownMenu.Item>
      )}

      {/* Copy Link - всегда показываем */}
      <DropdownMenu.Item
        className={s.DropdownMenuItem}
        onSelect={(event) => {
          event.preventDefault()
          setOpen(false)
          onCopyLink?.()
        }}
      >
        <CopyLinkIcon className={s.icon} />
        Copy Link
      </DropdownMenu.Item>
    </Dropdown>
  )
}

export default DropMenu
