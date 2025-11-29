// Dropdown.stories.tsx

// 1. Импортируйте ваш компонент
import { PostMenu } from './PostMenu'

// 2. ОБЯЗАТЕЛЬНО ПРИСУТСТВУЕТ ЭКСПОРТ ПО УМОЛЧАНИЮ (default export)
export default {
  // Название, под которым компонент будет отображаться в сайдбаре Storybook
  title: 'UI/PostMenu',
  // Сам компонент
  component: PostMenu,
  // Дополнительные параметры
  parameters: {
    layout: 'centered'
  }
}

// 3. Именованный экспорт для конкретной истории.
// Используем PostMenu() без параметров.
export const DefaultView = () => <PostMenu />
