export const ROUTES = {
  HOME: '/',

  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
    CREATE_NEW_PASSWORD: '/create-password',
    RESEND_NEW_PASSWORD_LINK: '/resend-recovery-password-link'
  },

  APP: {
    PROFILE: '/profile',
    DASHBOARD: '/settings'
  },
  LEGAL: {
    TERMS_OF_SERVICE: '/terms-of-service',
    PRIVACY_POLICY: '/privacy-policy'
  }
} as const
