const API = {
  // 用户认证（登录)
  postLogin: {
    method: 'post',
    url: 'mp/v1_0/authorizations'
  },
  // 获取文章列表
  getArticles: {
    method: 'get',
    url: 'mp/v1_0/articles'
  }
}
export default API
