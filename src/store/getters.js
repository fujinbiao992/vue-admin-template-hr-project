const getters = {
  sidebar: state => state.app.sidebar,
  user: state => state.user.state,
  token: state => state.user.token
}
export default getters
