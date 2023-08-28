import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

let url = ''
let imgUrl = '' // 图片地址可以是其它服务器地址

switch (process.env.VUE_APP_ENV) {
  case 'development': // 开发环境
    url = window.location.protocol + '//' + window.location.host + process.env.VUE_APP_BASE_API
    break
  case 'staging': // 模拟环境 测试
    url = window.location.protocol + '//' + window.location.host + process.env.VUE_APP_BASE_API
    imgUrl = url

    break
  case 'production': // 生产环境
    url = window.location.protocol + '//' + window.location.host + process.env.VUE_APP_BASE_API
    imgUrl = url
    break
}

// create an axios instance
const request = axios.create({
  baseURL: url,
  timeout: 60 * 1000 // request timeout
})

function getPromiseFunc(url, params, headers, config) {
  return new Promise((resolve, reject) => {
    request.get(url, { params, headers, ...config }).then((res) => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res.msg)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
function postPromiseFunc(url, params, headers, config) {
  return new Promise((resolve, reject) => {
    request.post(url, params, { headers, ...config }).then((res) => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res.msg)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

const get = function(url, params, type, config) {
  const headers = {
  }
  if (type === 'blob') {
    return getPromiseFunc(url, params, { ContentType: 'application/vnd.ms-excel', responseType: 'blob', ...config })
  } else {
    headers['Content-Type'] = 'application/json'
    return getPromiseFunc(url, params, headers, config)
  }
}
const post = function(url, params, type, config) {
  if (type === 1) {
    const formData = new FormData()
    for (const key in params) {
      if (params[key] !== null) {
        formData.append(key, params[key])
      }
    }

    return postPromiseFunc(url, formData, { 'Content-Type': 'multipart/form-data' }, config)
  } else if (type === 2) {
    const formData = new FormData()
    for (const key in params) {
      formData.append(key, params[key])
    }
    return postPromiseFunc(url, formData, { 'Content-Type': 'multipart/form-data' }, config)
  } else if (type === 'blob') {
    const formData = new FormData()
    for (const key in params) {
      if (params[key] !== null) {
        formData.append(key, params[key])
      }
    }
    return postPromiseFunc(url, formData, { 'Content-Type': 'application/vnd.ms-excel' }, config)
  } else {
    let paramsObj
    if (typeof params === 'object') {
      paramsObj = {}
      for (const key in params) {
        if (params[key] !== null) {
          paramsObj[key] = params[key]
        }
      }
    } else {
      paramsObj = params
    }
    return postPromiseFunc(url, paramsObj, { 'Content-Type': 'application/json' }, config)
  }
}

// request interceptor
request.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // token赋值
      config.headers['token'] = getToken()
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // 请求错误回调函数
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.request.responseType === 'blob') {
      return response
    }

    if (res.status === 401) { // token 错误，强制重新登录
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })

      store.dispatch('user/resetToken').then(() => {
        localStorage.clear()
        location.reload()
      })
    }

    if (res.status !== 200) {
      Message({
        message: res.msg || '',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.msg || '请求服务器错误'))
    }

    return res
  },
  error => {
    if (error.message.indexOf('timeout of') > -1) {
      error.message = '请求超时，请重新进行相关操作'
    }

    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export { imgUrl, get, post }

export default request
