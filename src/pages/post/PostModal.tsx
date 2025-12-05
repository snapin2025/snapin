'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { Dialog, DialogContent } from '@/shared/ui/modal'
import { usePost } from '@/entities/post'
import { Avatar, Spinner } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import s from './PostModal.module.css'

type PostModalProps = {
  postId: number
}

/**
 * Модальное окно поста с каруселью изображений и комментариями
 *
 * Особенности:
 * - Использует Intercepting Routes для перехвата навигации
 * - Поддерживает закрытие через ESC и клик по overlay
 * - Автоматически обновляет URL при открытии/закрытии
 * - Оптимизированная загрузка данных через React Query
 * - Использует существующий PostImageSlider компонент
 */
export const PostModal = ({ postId }: PostModalProps) => {
  const router = useRouter()
  const { data: post, isLoading, error } = usePost(postId)

  // Закрытие модального окна с возвратом на предыдущую страницу
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.back()
      }
    },
    [router]
  )

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return (
      <Dialog open={true} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={true} className={s.modalContent}>
          <div className={s.error}>
            <p>Ошибка загрузки поста</p>
            <button type="button" onClick={() => router.back()} className={s.errorButton}>
              Вернуться назад
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!post) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className={s.modalContent}>
        <div className={s.postContainer}>
          {/* Левая часть - карусель изображений */}
          <div className={s.imageSection}>
            <PostImageSlider
              images={post.images}
              postId={post.id}
              ownerId={post.ownerId}
              description={post.description}
              disableLink={true}
              className={s.modalSlider}
              size="large"
            />
          </div>

          {/* Правая часть - комментарии и информация */}
          <div className={s.sidebar}>
            {/* Заголовок с информацией о пользователе */}
            <header className={s.sidebarHeader}>
              <div className={s.userInfo}>
                <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
                <div>
                  <p className={s.userName}>{post.userName}</p>
                  <p className={s.postDate}>{getTimeDifference(post.createdAt, 'ru')}</p>
                </div>
              </div>
            </header>

            {/* Описание поста */}
            {post.description && (
              <div className={s.description}>
                <span className={s.descriptionUser}>{post.userName}</span>
                <span className={s.descriptionText}>{post.description}</span>
              </div>
            )}

            {/* Комментарии (заглушка - здесь будет реальный компонент комментариев) */}
            <section className={s.comments} aria-label="Комментарии">
              {/*  Добавить реальные комментарии через API */}
              <div className={s.commentPlaceholder}>Комментарии будут здесь</div>
            </section>

            {/* Футер с лайками и датой */}
            <footer className={s.sidebarFooter}>
              {/* Аватары пользователей, которые лайкнули */}
              {post.avatarWhoLikes.length > 0 && (
                <div className={s.likesAvatars}>
                  {post.avatarWhoLikes.slice(0, 4).map((avatar, index) => (
                    <div key={index} className={s.likeAvatarWrapper}>
                      <Avatar src={avatar} alt={`User ${index + 1}`} size="very_small" />
                    </div>
                  ))}
                </div>
              )}

              <p className={s.likesCount}>{post.likesCount.toLocaleString('ru-RU')} отметок «Нравится»</p>

              <p className={s.timestamp}>
                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {/* Поле для добавления комментария */}
              <div className={s.addComment}>
                <input
                  type="text"
                  placeholder="Добавьте комментарий..."
                  className={s.commentInput}
                  aria-label="Поле для ввода комментария"
                />
                <button type="button" className={s.commentSubmit} aria-label="Опубликовать комментарий">
                  Опубликовать
                </button>
              </div>
            </footer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
