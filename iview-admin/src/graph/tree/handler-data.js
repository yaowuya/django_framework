import position from './position'
import nodesModify from '../nodes/nodes-modify'

class HandlerData {
  constructor(data, dom) {
    this.dom = dom
    this.data = data
    this.localConfig = {
      showEdgeLabel: true,
      direction: 'LR'
    }
    this.localPosition = {
      canvas: {},
      nodes: {}
    }
  }

  // 获取拓扑图数据
  getGraphData(config = {}, position = {}) {
    Object.assign(this.localConfig, config)
    Object.assign(this.localPosition, position)
    this._convertData()
    this._setTreePosition()
    this._setUserNodesPosition()
    return this.data
  }

  // 生成树的节点位置信息
  _setTreePosition() {
    const p = new position.Position(this.dom)
    p.genTreeNodePosition(this.data, this.localConfig.direction)
  }

  // 设置用户保存的节点位置信息
  _setUserNodesPosition() {
    const nodesPosition = this.localPosition.nodes
    this.data.nodes = this.data.nodes.map(node => {
      const nodePos = nodesPosition[node.id]
      if (nodePos) {
        node.x = nodePos.x
        node.y = nodePos.y
      }
      return node
    })
  }

  // 转换数据格式为拓扑图需要的格式
  _convertData() {
    nodesModify.fitting(this.data)
  }
}

export default {
  HandlerData
}
