//я должна быть ssg
import { CreatePostLauncher } from '@/features/auth/create-post/CreatePostLauncher'

export const HomePage = () => {
  return (
    <>
      Hello home page
      <div>
        <CreatePostLauncher />
      </div>
    </>
  )
}
