const ACCESS_TOKEN_CHANGED_EVENT = 'access-token-changed'

export type AccessTokenChangedDetail = {
  accessToken: string | null
}

export const emitAccessTokenChanged = (accessToken: string | null) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent<AccessTokenChangedDetail>(ACCESS_TOKEN_CHANGED_EVENT, {
      detail: { accessToken }
    })
  )
}

export const onAccessTokenChanged = (handler: (accessToken: string | null) => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<AccessTokenChangedDetail>
    handler(customEvent.detail?.accessToken ?? null)
  }

  window.addEventListener(ACCESS_TOKEN_CHANGED_EVENT, listener)

  return () => {
    window.removeEventListener(ACCESS_TOKEN_CHANGED_EVENT, listener)
  }
}
