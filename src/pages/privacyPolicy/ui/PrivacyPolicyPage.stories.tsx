import { Meta, StoryObj } from '@storybook/nextjs'
import { PrivacyPolicyPage } from '@/pages/privacyPolicy'

const meta: Meta<typeof PrivacyPolicyPage> = {
  title: 'Pages/PrivacyPolicyPage',
  component: PrivacyPolicyPage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof PrivacyPolicyPage>

export default meta
type Story = StoryObj<typeof PrivacyPolicyPage>

export const Default: Story = {
  args: {}
}
