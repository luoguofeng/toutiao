import axios from 'axios'
import service from './api'
import { Message } from 'element-ui'

// service 循环遍历输出不同的请求方法
let instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  timeout: 1000
})
const Http = {} // 包裹请求方法的容器
for (let key in service) {
  let api = service[key] // url method
  // async 作用:避免进入回调地狱
  // params 请求参数get:url,put,post,patch,delete:url
  // isFormData 标志是否是form-data请求
  // config 配置参数
  Http[key] = async function (params, isFormData = false, config = {}) {
    let newParams = {}
    // content-type是否是form-data的判断
    if (params && isFormData) {
      newParams = new FormData()
      for (let i in params) {
        newParams.append(i, params[i])
      }
    } else {
      newParams = params
    }
    // 不同请求的判断
    let response = {} // 请求的返回值
    if (api.method === 'post') {
      try {
        response = await instance[api.method](api.url, newParams, config)
      } catch (error) {
        response = error
      }
    } else if (api.method === 'get') {
      config.params = newParams
      try {
        response = await instance[api.method](api.url, config)
      } catch (error) {
        response = error
      }
    }
    return response // 返回响应值
  }
}

// 拦截器的添加
instance.interceptors.request.use(
  config => {
    // 发起请求前做些什么
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      config.headers.Authorization = `Bearer ${userInfo.token}`
    }
    return config
  },
  () => {
    // 请求错误
    Message({
      message: '请求错误,请稍后重试', // 消息文字
      center: true, // 文字是否居中
      duration: 3000, // 显示时间, 毫秒。设为 0 则不会自动关闭
      type: 'error' // 主题
    })
  }
)
// 响应拦截器
instance.interceptors.response.use(
  res => {
    // 请求成功
    return res.data.data
  },
  // 请求错误
  () => {
    Message.close()
    Message({
      message: '请求错误,请稍后重试', // 消息文字
      center: true, // 文字是否居中
      duration: 3000, // 显示时间, 毫秒。设为 0 则不会自动关闭
      type: 'error' // 主题
    })
  }
)

export default Http
