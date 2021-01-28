import G6 from '@antv/g6'

class Position {
  constructor(dom) {
    this.dom = dom
  }

  // 借tree graph 生成节点位置信息
  genTreeNodePosition(data, direction = 'LR') {
    const dom = this.dom
    const handler = new TreeData(data)
    const treeData = handler.makeTreeNodeData()
    const options = {
      width: dom.clientWidth,
      height: dom.clientHeight,
      container: dom,
      fitCenter: true,
      layout: {
        type: 'compactBox',
        direction: direction,
        focusNode: 'biz-2',
        getWidth(d) {
          return 160 + 80
        },
        getHeight: (cfg) => {
          const config = {
            width: 160,
            padding: 10,
            headerHeight: 38,
            nodeHeight: 38,
            nodeMargin: 10
          }
          const status = cfg.status
          const borderHeight = 3
          const shadowHeight = 3
          if (status) {
            return config.headerHeight + borderHeight
          }
          const num = (cfg.nodes || []).length
          return num * (config.nodeHeight + config.nodeMargin) + borderHeight + shadowHeight + config.padding + config.headerHeight
        },
        getVGap: (cfg) => {
          return direction === 'LR' ? 10 : 40
        },
        getHGap: (cfg) => {
          return direction === 'LR' ? 40 : -30
        }
      },
      modes: {
        default: ['drag-canvas']
      }
    }
    const graph = new G6.TreeGraph(options)
    graph.data(treeData)
    graph.render()
    graph.fitView()
    graph.destroy()
    this.dom.innerHtml = ''
  }

  __makeTreeNodePosition(data, position = {}) {
    position[data.id] = {
      x: data.x,
      y: data.y
    }
    const children = data.children || []
    if (children.length) {
      children.forEach(child => {
        this.__makeTreeNodePosition(child, position)
      })
    }
    return position
  }
}

class TreeData {
  constructor(data) {
    this.nodes = data.nodes || []
    this.edges = data.edges || []
    this.curr = data.curr || {}
  }

  makeTreeNodeData() {
    const curr = this.nodes.find(node => node.id === this.curr.id) || {}
    const pidNodesMap = getPidNodesMap(this.nodes)
    getTreeChildrenData(curr, pidNodesMap)
    return curr
  }
}

const getPidNodesMap = (nodes) => {
  const pidNodesMap = {}
  nodes.forEach(node => {
    const pid = node.pid
    const pidNodes = pidNodesMap[pid] || []
    pidNodes.push(node)
    pidNodesMap[pid] = pidNodes
  })
  return pidNodesMap
}

const getTreeChildrenData = (node, pidNodeMap) => {
  const nodeId = node.id
  const children = pidNodeMap[nodeId] || []
  if (children.length) {
    children.forEach(cNode => {
      cNode['children'] = getTreeChildrenData(cNode, pidNodeMap)
    })
  }
  node.children = children
  return children
}

export default {
  Position
}
