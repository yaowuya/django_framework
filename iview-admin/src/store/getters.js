const getters = {
  name: state => state.user.name,
  roles: state => state.user.roles,
  out: state => state.user.out,
  logo: state => state.user.logo,
  collapsed: state => state.app.collapsed
}
export default getters
