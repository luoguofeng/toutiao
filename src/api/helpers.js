import axios from 'axios'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
const ERR_OK = 201

export function get (url) {
  return function (params) {
    return axios
      .get(url, {
        params
      })
      .then(res => {
        const { error, data } = res.data
        if (error === ERR_OK) {
          return data
        }
      })
      .catch(() => {})
  }
}
export function post (url) {
  return function (data) {
    return axios.post(url, data)
  }
}
