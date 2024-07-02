import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 发送请求之前
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    const code = res.code
    const msg = res.message
    if (code !== 200) {
      if (code === 401) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).then(() => {
          removeToken()
          router.push(`/login`)
        })
        return Promise.reject(new Error(msg))
      } else if (code === 500) {
        Message({
          message: msg,
          type: 'error'
        })
        return Promise.reject(new Error(msg))
      } else {
        Message({
          message: msg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject()
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
