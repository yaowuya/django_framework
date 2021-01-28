import confirm from './modal/confirm'

const install = function(Vue) {
  Vue.prototype.$CWConfirm = confirm.install
}

export default install
