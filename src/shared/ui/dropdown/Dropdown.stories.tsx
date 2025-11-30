import DropMenu from '@/shared/ui/dropdown/DropMenu'
import { PostCard } from '@/shared/ui/post'

export default {
  title: 'UI Components',
  parameters: {
    layout: 'centered'
  }
}

export const DropMenuStory = () => <DropMenu />

// Состояния карточки
export const State1_WithMenu = () => (
  <PostCard userName="UserName" avatar="/girl.png" description="" timeAgo="" showDropMenu={true} showActions={false} />
)

export const State2_WithAnswer = () => (
  <PostCard
    userName="UserName"
    avatar="/girl.png"
    description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    timeAgo="2 hours ago"
    showDropMenu={false}
    showActions={true}
  />
)

// export const State3_Full = () => (
//   <PostCard
//     userName="UserName"
//     avatar="/girl.png"
//     description="UserName Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
//     timeAgo="2 hours ago"
//     showDropMenu={true}
//     showActions={true}
//   />
// )
