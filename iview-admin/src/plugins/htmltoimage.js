import html2canvas from 'html2canvas'
import Vue from 'vue'

const IMAGE = {}

IMAGE.install = function(Vue, options) {
  Vue.prototype.$toImage = function(id, imgName) {
    const ele = document.querySelector(`#${id}`)
    const eleW = ele.offsetWidth// 获得该容器的宽
    const eleH = ele.offsetHeight// 获得该容器的高

    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = eleW * scale // 将画布宽&&高放大两倍
    canvas.height = eleH * scale
    canvas.style.width = eleW + 'px'
    canvas.style.height = eleH + 'px'

    const context = canvas.getContext('2d')
    context.scale(scale, scale)
    html2canvas(ele, {
      dpi: 300,
      // allowTaint: true,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
      useCORS: true, // 允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
      scale: scale
    }).then((canvas) => {
      const pageData = canvas.toDataURL('image/jpeg', 1.0).replace('image/png', 'image/octet-stream')
      document.querySelector('#day-image').setAttribute('src', pageData)
    })
  }
}

Vue.use(IMAGE)
export default IMAGE
