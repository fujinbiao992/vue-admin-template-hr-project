
// 全局getters  创建快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  userId: (state) => {
    return state.user.userInfo.userId
  }
}
export default getters
