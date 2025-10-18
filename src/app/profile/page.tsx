//Редирект (profile/123 - где 123 мой id) или, если не авторизован, то на /

import {redirect} from "next/navigation";

export default function ProfileRedirect() {
  //Логика редиректа на мой профиль
  const isAuth = true
  const profileId = 123

  if (!isAuth) {
    redirect('/')
  }

  redirect(`/profile/${profileId}`)
}