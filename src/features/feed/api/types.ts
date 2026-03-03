// создаем типы
// Типы для подписки/отписки

// POST /api/v1/users/following - подписаться
export type FollowParams = {
  selectedUserId: number
}

// DELETE /api/v1/users/follower/{userId} - отписаться
export type UnfollowParams = {
  userId: number // в пути запроса
}
