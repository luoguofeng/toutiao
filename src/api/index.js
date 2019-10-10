import { post } from './helpers'

// 登录请求
const postLogin = post('/mp/v1_0/authorizations')

export { postLogin }
