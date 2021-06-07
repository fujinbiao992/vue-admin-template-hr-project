const getters = {
  sidebar: state => state.app.sidebar,
  user: state => state.user.state,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto

}
export default getters
