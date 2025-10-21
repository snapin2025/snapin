import type { Meta, StoryObj } from '@storybook/nextjs'
import { Input } from './input'
import { useState } from 'react'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search']
    },
    isDisabled: {
      control: 'boolean'
    },
    error: {
      control: 'text'
    }
  }
}

export default meta
type Story = StoryObj<typeof Input>

export const Email: Story = {
  args: {
    id: 'email-input',
    type: 'email',
    placeholder: 'Epam@epam.com',
    label: 'Email'
  }
}

export const Password: Story = {
  args: {
    id: 'password-input',
    type: 'password',
    placeholder: 'Epam@epam.com',
    label: 'Password'
  }
}

export const Search: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />
  },
  args: {
    id: 'search-input',
    type: 'search',
    placeholder: 'Input search',
    label: 'Search'
  }
}

export const WithError: Story = {
  args: {
    id: 'error-input',
    type: 'text',
    placeholder: 'Enter text...',
    label: 'Input with Error',
    error: 'Error text'
  }
}

export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    type: 'text',
    placeholder: 'Disabled input',
    label: 'Disabled Input',
    isDisabled: true
  }
}

export const WithoutLabel: Story = {
  args: {
    id: 'no-label-input',
    type: 'text',
    placeholder: 'Input without label'
  }
}

export const PasswordWithError: Story = {
  args: {
    id: 'password-error',
    type: 'password',
    placeholder: 'Epam@epam.com',
    label: 'Password',
    error: 'Error text'
  }
}

export const DisabledWithValue: Story = {
  args: {
    id: 'disabled-value-input',
    type: 'text',
    placeholder: 'Disabled with value',
    label: 'Disabled Input',
    isDisabled: true,
    value: 'Epam@epam.com'
  }
}

export const SearchWithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />
  },
  args: {
    id: 'search-error',
    type: 'search',
    placeholder: 'Input search',
    label: 'Search',
    error: 'Error text'
  }
}
