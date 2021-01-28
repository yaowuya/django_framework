import G6 from '@antv/g6'
import nodesUtil from './nodes-modify'

const width = 150
const height = 38
const registerNodes = () => {
  // 注册自定义节点，包括一个子分组作为keyShape
  G6.registerNode(
    'classic-canvas',
    {
      options: {
        // 自定义其他shape在不同state下的样式，避免只在keyShape上生效
        stateStyles: {
          inactive: {
            'key-shape': {
              opacity: 0.2
            },
            'sub-group': {
              opacity: 0.2
            }
          },
          focus: {
            'key-shape': {
              stroke: '#f00',
              lineWidth: 2
            }
          }
        }
      },
      draw(cfg, group) {
        const keyShape = addMainShape(cfg, group)
        const subShape = group.addGroup(
          {
            name: 'sub-group',
            opacity: 1
          }
        )
        addTextShape(cfg, subShape)
        // 处理图标逻辑
        addIconShape(cfg, subShape)
        addPathShape(cfg, subShape)
        // 必须返回一个keyShape
        return keyShape
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [0.5, 1],
          [1, 0.5],
          [0.5, 0]
        ]
      }
    },
    'rect'
  )
}

export default {
  registerNodes
}

const addMainShape = (cfg, group) => {
  return group.addShape(
    'rect', {
      attrs: {
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: '#fff',
        radius: height / 2,
        stroke: nodesUtil.getColor(cfg['color'], 'rect'),
        lineWidth: 1,
        shadowColor: '#E7EBEE',
        shadowBlur: 100,
        cursor: 'pointer'
      },
      name: 'key-shape',
      zIndex: 0,
      draggable: true
    })
}

// const addIconShape = (cfg, group) => {
//   let ccImage = require(`../../assets/cmdb/cc-default.png`)
//   try {
//     ccImage = require(`../../assets/cmdb/${cfg['bk_obj_icon'].substr(5)}.png`)
//   } catch (e) {
//     console.log('not find ', cfg['bk_obj_icon'])
//   }
//   return group.addShape(
//     'image', {
//       attrs: {
//         x: 5,
//         y: 8,
//         img: ccImage,
//         width: 40,
//         height: 22
//       },
//       name: 'icon-box',
//       draggable: true
//     })
// }
const addIconShape = (cfg, group) => {
  let ccName = 'cc-default'
  if (cfg['bk_obj_icon'].substr(5)) {
    ccName = cfg['bk_obj_icon'].substr(5)
  } else {
    console.log('not find ', cfg['bk_obj_icon'])
  }
  return group.addShape(
    'text', {
      attrs: {
        x: 20,
        y: 8,
        fontFamily: 'font_family', // 对应 CSS 里面的 font-family: "iconfont";
        text: nodesUtil.getIcon(ccName), // logo 为 unicode 对应的 name
        textAlign: 'center',
        textBaseline: 'top',
        cursor: 'pointer',
        fontSize: 22,
        fill: nodesUtil.getColor(cfg['color'], 'icon'),
        width: 40,
        height: 22
      },
      name: 'icon-box',
      draggable: true
    })
}

const addPathShape = (cfg, group) => {
  return group.addShape(
    'path', {
      attrs: {
        path: [
          ['M', 36, 37.5],
          ['L', 36, 0.5]
        ],
        stroke: nodesUtil.getColor(cfg['color'], 'path'),
        lineWidth: 1
      },
      name: 'icon-division'
    })
}

const addTextShape = (cfg, group) => {
  return group.addShape(
    'text', {
      attrs: {
        x: 88,
        y: 13,
        text: cfg.label,
        textAlign: 'center',
        fontSize: 12,
        fill: '#333',
        textBaseline: 'top',
        cursor: 'pointer'
      },
      name: 'node' + '-' + cfg.id,
      zIndex: 1,
      draggable: true
    })
}
