//Страница с постами пользователя где есть id пользователя. А так же модальное окно (с постом у которого id является query-параметром или созданием поста)
// Страница доступна всем, даже неавторизованным(отличие в наличии сайдбара и кнопок по управлению постами (если это мой профиль))

type Props = {
  params: { id: string }
  searchParams?: { postId: string, action?: string }
}

export default function ProfilePostsPage({params, searchParams}: Props) {
  const userId = params.id
  const postId = searchParams?.postId
  let action = searchParams?.action

  // Проверка если одновременно есть postId и action=create — удаляем action из URL
  if (postId && action === 'create') {
    {/*Логика изменения урла*/
    }
  }

  //Логика рендера
  if (userId) {
    console.log("Загрузка страницы с постами в том числе сайдбаром и кнопками по управлению постами")
  } else {
    console.log("Загрузка страницы с постами")
  }

  return (
    <div>
      <h1>Профиль пользователя </h1>
      {/*рендер постов */}
      <div>
        <p>Посты пользователя</p>
      </div>

      {/* Если есть query-параметр postId или query-параметр action — рендер модалки, если есть оба параметра, то модалка рендерится только с postId*/}
      {postId ? 'отрисовка модалки' : null}
    </div>
  )
}