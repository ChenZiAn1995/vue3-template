import axios from 'axios'
import 'vant/es/dialog/style'
// 生成axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 5000, // 超时时长 毫秒
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const { data: res } = response
    // 如果http请求错误
    if (response.status !== 200) {
      // Dialog({
      //   message: res.msg || 'Error',
      // })：
    }
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default service
