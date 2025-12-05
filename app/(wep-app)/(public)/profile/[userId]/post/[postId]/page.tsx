import { Metadata } from 'next'


export const metadata: Metadata = { title: 'Post' }

const PostPage = async ({ params }: { params: Promise<{ userId: string; postId: string }> }) => {
  const { userId } = await params
  return <></>
}

export default PostPage
