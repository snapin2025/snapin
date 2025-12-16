'use client'
import { ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { SETTINGS_PART, SettingsPart } from '@/shared/lib/routes'
import s from './Settings.module.css'

export function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams?.get('part') ?? 'info'

  const onTabChange = (value: string) => {
    router.push(`/settings?part=${value as SettingsPart}`)
  }
  return (
    <section>
      <Tabs defaultValue={'info'} value={currentTab} onValueChange={onTabChange}>
        <TabsList style={{ display: 'flex', justifyContent: 'space-between' }} className={s.tabList}>
          <TabsTrigger className={s.tab} value={SETTINGS_PART.INFO}>
            General information
          </TabsTrigger>
          <TabsTrigger className={s.tab} value={SETTINGS_PART.DEVICES}>
            Devices
          </TabsTrigger>
          <TabsTrigger className={s.tab} value={SETTINGS_PART.SUBSCRIPTIONS}>
            Account Management
          </TabsTrigger>
          <TabsTrigger className={s.tab} value={SETTINGS_PART.PAYMENTS}>
            My payments=
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div>{children}</div>
    </section>
  )
}
