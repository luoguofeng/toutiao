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
  },
  // 获取评论数据
  getComments: {
    method: 'get',
    url: 'mp/v1_0/articles'
  },
  // 改变评论状态
  editCommentsStatus: {
    method: 'put',
    url: 'mp/v1_0/comments/status'
  },
  // 获取用户图片素材
  getMaterials: {
    method: 'get',
    url: 'mp/v1_0/user/images'
  },
  // 收藏图片素材
  collectMaterial: {
    method: 'put',
    url: 'mp/v1_0/user/images'
  },
  // 删除图片素材
  deleteMaterial: {
    method: 'delete',
    url: 'mp/v1_0/user/images'
  },
  // 获取用户资料
  getUserInfo: {
    method: 'get',
    url: 'mp/v1_0/user/profile'
  },
  // 编辑用户资料
  editUserInfo: {
    method: 'patch',
    url: 'mp/v1_0/user/profile'
  },
  // 编辑用户头像
  editUserPhoto: {
    method: 'patch',
    url: 'mp/v1_0/user/photo'
  }
}
export default API
