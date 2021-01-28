import Vue from 'vue'
import { Message } from 'view-design'
// 深拷贝
Vue.prototype.$Copy = function(data) {
  return JSON.parse(JSON.stringify(data))
}
Vue.prototype.$toStr = function(data) {
  if (typeof (data) === 'string') {
    return data
  } else {
    const midstr = []
    for (const i in data) {
      midstr.push(data[i])
    }
    return midstr.join(',')
  }
}
// message提示
Vue.prototype.$CwMessage = function(type, data, duration = 1.5) {
  let msg = ''
  if (typeof (data) === 'string') {
    msg = data
  } else {
    msg = JSON.stringify(data)
  }
  Message[type]({
    content: msg,
    background: true,
    duration: duration
  })
}
