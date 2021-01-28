module.exports = {

  title: 'iview-admin-template',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'Home',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 代理请求头
   */
  apiUrl: 'api/',
  /**
   * @description 本地代理url
   */
  devProxyTarget: 'http://127.0.0.1:8075/'
}
