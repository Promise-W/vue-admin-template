import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
  // return new Promise((resolve, reject) => {
  //   resolve({
  //     data: {
  //       token: 'test123'
  //     }
  //   })
  // })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
  // return new Promise((resolve, reject) => {
  //   resolve({
  //     data: {
  //       name: 'admin',
  //       avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  //     }
  //   })
  // })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
