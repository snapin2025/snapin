import { TermsOfServicePage } from './TermsOfServicePage'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof TermsOfServicePage> = {
  title: 'Pages/TermsOfServicePage',
  component: TermsOfServicePage,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TermsOfServicePage>

export default meta
type Story = StoryObj<typeof TermsOfServicePage>

export const Default: Story = {
  args: {}
}
