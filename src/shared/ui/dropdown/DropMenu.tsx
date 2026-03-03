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
  isFollowing?: boolean
}

export const DropMenu = ({
  onEdit,
  onDelete,
  onFollow,
  onUnfollow,
  onCopyLink,
  ownerId,
  currentUserId,
  isFollowing = false
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
        <>
          {/* Пункт "Подписаться" (с иконкой плюса) */}
          {isFollowing ? ( // дабавила сюда так надо менють пункт меню
            // Если подписан - показываем Unfollow
            <DropdownMenu.Item
              className={s.DropdownMenuItem}
              onSelect={(event) => {
                event.preventDefault()
                setOpen(false)
                // onFollow?.()
                onUnfollow?.() // дабавила
              }}
            >
              {/*дабавила иконку UnfollowIcon */}
              <UnfollowIcon className={s.icon} />
              {/*<FollowIcon className={s.icon} />*/}
              {/*Follow*/}
              Unfollow
            </DropdownMenu.Item>
          ) : (
            //дабавила сюда так меняем с одного на другой пунк
            <DropdownMenu.Item
              className={s.DropdownMenuItem}
              onSelect={(event) => {
                event.preventDefault()
                setOpen(false)
                onFollow?.()
                // onUnfollow?.()
              }}
            >
              {/*//было FollowIcon*/}
              <FollowIcon className={s.icon} />
              {/*<UnfollowIcon className={s.icon} />*/}
              Follow
              {/*было  Unfollow*/}
              {/*Unfollow*/}
            </DropdownMenu.Item>
            // дабавила сюда скобку
          )}
        </>
      )}
      {/* ✅ CopyLink ВСЕГДА, вне canFollow */}
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
