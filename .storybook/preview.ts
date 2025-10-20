import type {Preview} from '@storybook/nextjs'
import {color} from 'storybook/theming'
import '../src/app/styles/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: color // Устанавливает тёмный фон по умолчанию
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
