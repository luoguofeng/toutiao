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
  },
  // 删除文章
  delArticle: {
    method: 'delete',
    url: 'mp/v1_0/articles'
  },
  // 获取文章频道
  getChannels: {
    method: 'get',
    url: 'mp/v1_0/channels'
  },
  // 发表文章
  pubArticle: {
    method: 'post',
    url: 'mp/v1_0/articles'
  },
  // 编辑文章
  editArticle: {
    method: 'put',
    url: 'mp/v1_0/articles'
  },
  // 获取指定文章
  getArticleById: {
    method: 'get',
    url: 'mp/v1_0/articles'
  }
}
export default API
