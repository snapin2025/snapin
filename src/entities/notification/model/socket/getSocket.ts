import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    socket = io('https://inctagram.work', {
      query: {
        accessToken: accessToken
      },
      path: '',
      transports: ['websocket']
    })
    socket.on('connect', () => {
      console.log('Подключились!!!')
    })
    socket.on('connect_error', () => {
      console.log('Ошибка((!!!')
    })
    socket.on('disconnect', () => {
      console.log('Ошибка((!!!')
    })
  }
  return socket
}
