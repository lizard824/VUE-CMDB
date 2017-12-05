import fetch from '@/utils/fetch'

export function login(username, password) {
  const data={
    username,
    password
  }


  return fetch({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'post',
    data:{token}
  })
}

export function logout(username) {
  return fetch({
    url: '/user/logout',
    method: 'post',
    data:{username}
  })
}
