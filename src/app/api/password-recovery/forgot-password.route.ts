// пишем логику для капчи
// src/app/api/password-recovery/forgot-password.route.ts

import { NextRequest, NextResponse } from 'next/server'

// Пока это заглушка. В реальности здесь будет обращение к API Google reCAPTCHA для проверки токена.
const recaptchaAdapter = {
  isValid(value: string): boolean {
    // Заглушка: всегда возвращает true.
    // В реальности здесь нужно отправить токен на Google reCAPTCHA API для проверки.
    return true
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, recaptchaValue } = body

    // Проверяем reCAPTCHA
    if (!recaptchaAdapter.isValid(recaptchaValue)) {
      return NextResponse.json({ error: 'you are robot' }, { status: 400 })
    }

    // Здесь должна быть логика отправки email для восстановления пароля.
    // Пока заглушка: просто возвращаем сообщение.

    return NextResponse.json({ message: `email sent to your email: ${email}` })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
