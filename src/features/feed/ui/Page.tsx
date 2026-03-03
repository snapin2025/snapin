import type { Metadata } from 'next'
import { FeedPageClient } from './FeedPageClient'

export const metadata: Metadata = {
  title: 'Feed | Incatgram',
  description: 'Лента публикаций'
}

export default function Feed() {
  return <FeedPageClient />
}
