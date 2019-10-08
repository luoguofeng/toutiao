import axios from 'axios'

export function getLogin () {
  return axios({
    url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
    method: 'post',
    data: this.form
  }).then(res => {
    this.$message({
      message: '恭喜你,登录成功',
      type: 'success'
    })
    this.$router.push('/home')
  }).catch(() => {
    this.$message.error('手机号或者验证码错误')
  })
}
