import G6 from '@antv/g6'
import fonts from '@/assets/iconfont/iconfont.json'

const _fittingString = (str, maxWidth, fontSize) => {
  if (!str) {
    str = ''
  }
  const ellipsis = '...'
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
  let currentWidth = 0
  let res = str
  const pattern = new RegExp('[\u4E00-\u9FA5]+') // 识别中文字符的正则模式
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return
    if (pattern.test(letter)) {
      // 半角字符的长度计算
      currentWidth += fontSize
    } else {
      // 全角字符的长度计算
      currentWidth += G6.Util.getLetterWidth(letter, fontSize)
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`
    }
  })
  return res
}

// 处理节点超长文本
const fitting = (data, isGroup) => {
  if (isGroup) {
    // 节点分组的处理逻辑
    data.nodes.forEach((nodes) => {
      nodes.label = _fittingString(nodes.label, 90, 12)
      nodes.nodes.forEach((node) => {
        node.label = _fittingString(node.label, 90, 12)
      })
      nodes.children.forEach((child) => {
        child.label = _fittingString(child.label, 90, 12)
      })
    })
  } else {
    // 单个节点的处理逻辑
    data.nodes.forEach((node) => {
      node.label = _fittingString(node.label, 90, 12)
    })
  }
  data.edges.forEach((edge) => {
    edge.label = _fittingString(edge.label, 120, 12)
  })
}

// 模型图标SVG图片转换成base64格式
const toBase64 = (image, rgb = [58, 132, 255]) => {
  let canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, image.width, image.height)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = rgb[0]
    imageData.data[i + 1] = rgb[1]
    imageData.data[i + 2] = rgb[2]
  }
  ctx.putImageData(imageData, 0, 0)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" stroke="" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50">
                    <image width="100%" xlink:href="${canvas.toDataURL('image/svg')}"></image>
                </svg>`
  canvas = null
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// 动态获取分组节点长度
const getHeight = (cfg, custom) => {
  const borderHeight = 0
  const shadowHeight = 3
  // 分组节点收起时，总长度等于节点header长度
  if (cfg.type === 'classic-group-folded') {
    return custom.headerHeight + borderHeight // 38
  }
  // 节点展开时，计算子节点数，总长度为单节点及节点间间距的倍数
  const num = (cfg.nodes || []).length
  return num * (custom.nodeHeight + custom.nodeMargin) + borderHeight + shadowHeight + custom.padding + custom.headerHeight
}

// 计算展开与收起两种状态节点的锚点位置
const getAnchorPoints = (cfg, custom) => {
  const anchors = []
  const nodes = cfg.nodes
  const groupHeight = getHeight(cfg, custom)
  // 计算每个节点在分组中的位置，设置锚点，锚点会自动与边连接
  nodes.forEach(node => {
    let t
    if (cfg.type === 'classic-group-folded') {
      // 分组节点收起，锚点数只有一组
      // let maxHeight = getHeight(cfg.nodes, false, custom);
      t = 0.5
    } else {
      // 分组节点展开时，锚点组与子节点数一致
      const index = node.index
      const nodeHeight = custom.headerHeight + 2 + custom.nodeMargin * index + custom.nodeHeight / 2 + custom.nodeHeight * (index - 1)
      t = nodeHeight / groupHeight
    }
    anchors.push(...[
      [1, t],
      [0, t]
    ])
  })
  return anchors
}

const icons = fonts.glyphs.map((icon) => {
  return {
    name: icon.name,
    unicode: String.fromCodePoint(icon.unicode_decimal) // `\\u${icon.unicode}`,
  }
})

const getIcon = (type) => {
  const matchIcon = icons.find((icon) => {
    return icon.name === type
  }) || { unicode: '', name: 'default' }
  return matchIcon.unicode
}

const getColor = (color, type) => {
  let defaultColor = '#DADEE2'
  if (type === 'icon') {
    defaultColor = '#3a84ff'
  }
  const colorObj = {
    default: defaultColor,
    warning: '#fe9900',
    danger: '#ff2525'
  }
  return colorObj[color] || '#3a84ff'
}
export default {
  fitting,
  toBase64,
  getHeight,
  getAnchorPoints,
  getIcon,
  getColor
}
