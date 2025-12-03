// import { EditPostForm } from './EditPostForm'
//
// export default {
//   title: 'Components/EditPostForm',
//   component: EditPostForm // ← можно убрать если не нужны Controls
// }
//
// export const Default = () => <EditPostForm isOpen={true} onClose={() => console.log('closed')} />

import { EditPostForm } from './EditPostForm'
import { Meta } from '@storybook/nextjs'

const meta: Meta<typeof EditPostForm> = {
  title: 'Components/EditPostForm',
  component: EditPostForm
}

export default meta

export const Open = {
  args: {
    isOpen: true,
    onClose: () => {}
  }
}

export const Closed = {
  args: {
    isOpen: false,
    onClose: () => {}
  }
}
