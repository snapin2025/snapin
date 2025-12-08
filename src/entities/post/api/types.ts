export type ImagePost = {
  createdAt: string
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}

export type Owner = {
  firstName: string
  lastName: string
}

export type Post = {
  avatarOwner: string
  avatarWhoLikes: string[]
  createdAt: string
  description: string
  id: number
  images: ImagePost[]
  isLiked: boolean
  likesCount: number
  location: null
  owner: Owner
  ownerId: number
  updatedAt: string
  userName: string
}

export type ResponsesPosts = {
  totalCount: number
  pageSize: number
  items: Post[]
  totalUsers: number
}
