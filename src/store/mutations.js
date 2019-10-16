export default {
  updateUserInfo (state, v) {
    state.userInfo = { ...state.userInfo, ...v }
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
  }
}
