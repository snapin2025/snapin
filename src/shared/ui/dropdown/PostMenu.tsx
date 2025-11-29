'use client'

import { Dropdown } from './Dropdown'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import s from './Dropdown.module.css'
import { CopyLinkIcon, DeleteIcon, DotsIcon, EditIcon, FollowIcon, UnfollowIcon } from '@/shared/ui'

export const PostMenu = () => {
  // 👇 Триггером теперь будет ваша иконка троеточия
  const myTrigger = (
    <button className="IconButton" aria-label="Post options">
      <DotsIcon />
    </button>
  )

  return (
    <Dropdown trigger={myTrigger}>
      <DropdownMenu.Item className={s.DropdownMenuItem} onSelect={() => console.log('Edit')}>
        <EditIcon className={s.icon} />
        Edit Post
      </DropdownMenu.Item>

      <DropdownMenu.Item className={s.DropdownMenuItem} onSelect={() => console.log('Delete')}>
        <DeleteIcon className={s.icon} />
        Delete Post
      </DropdownMenu.Item>

      {/* Пункт "Подписаться" (с иконкой плюса) */}
      <DropdownMenu.Item className={s.DropdownMenuItem} onSelect={() => console.log('Follow')}>
        <FollowIcon className={s.icon} />
        Follow
      </DropdownMenu.Item>
      {/* Пункт "одписаться" (с иконкой минус) */}
      <DropdownMenu.Item className={s.DropdownMenuItem} onSelect={() => console.log('Unfollow')}>
        <UnfollowIcon className={s.icon} />
        Unfollow
      </DropdownMenu.Item>

      <DropdownMenu.Item className={s.DropdownMenuItem} onSelect={() => console.log('Copy Link')}>
        <CopyLinkIcon className={s.icon} />
        Copy Link
      </DropdownMenu.Item>
    </Dropdown>
  )
}

export default PostMenu
//<PostMenu /> можно использовать в любом месте проекта.
