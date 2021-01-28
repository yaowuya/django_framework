<template>
  <div id="container" class="graph-container" />
</template>

<script>
import G6 from '@antv/g6'
import nodes from './nodes'
import tree from './tree'
import { mapGetters } from 'vuex'
import { _debounce } from '@/utils/util'

export default {
  name: 'Graph',
  props: {
    graphData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      container: null,
      width: 0,
      height: 0,
      graph: null
    }
  },
  computed: {
    ...mapGetters(['collapsed'])
  },
  watch: {
    collapsed(val) {
      const that = this
      this.resizeGraph(that)
    }
  },
  created() {
  },
  mounted() {
    this.container = document.getElementById('container')
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    if (Object.keys(this.graphData).length > 0) {
      this.initGraph()
      const that = this
      window.onresize = () => {
        return (() => {
          this.resizeGraph(that)
        })()
      }
    }
  },
  methods: {
    resizeGraph(that) {
      if (!that.graph || that.graph.get('destroyed')) return
      if (!that.container || !that.container.clientWidth || !that.container.clientHeight) return
      that.graph.changeSize(that.container.clientWidth, that.container.clientHeight)
    },
    initGraph() {
      // console.log(this.graphData)
      this.destroyGraph()
      this.registerComponents()
      this.createGraph()
      if (this.graph) {
        this.onGraphEvent()
      }
    },
    // 销毁拓扑图
    destroyGraph() {
      if (this.graph) {
        this.graph = null
      }
      document.getElementById('container').innerHTML = ''
    },
    // 注册组件
    registerComponents() {
      nodes.registerNodes()
    },
    // 创建图表
    createGraph() {
      const dom = document.getElementById('container')
      const data = this.getGraphData(this.$Copy(this.graphData), dom)
      data.nodes = data.nodes.filter(node => {
        if (node.level !== 0) {
          return node
        }
      })
      data.edges = data.edges.filter(edge => {
        if (!edge.source.includes('biz-')) {
          return edge
        }
      })
      this.graph = new G6.Graph(this.getGraphOptions())
      this.graph.data(data)
      this.graph.render()
      setTimeout(() => {
        this.graph.paint()
      }, 16)
      // this.graph.fitView()
    },
    getGraphOptions() {
      const grid = new G6.Grid()
      const minimap = new G6.Minimap({
        container: 'miniMap',
        size: [180, 100],
        className: 'graph-mini-map',
        type: 'delegate'
      })
      const toolbar = new G6.ToolBar({
        className: 'graph-tool-bar'
      })
      const contextMenu = new G6.Menu({
        getContent(evt) {
          return `
              <div class="graph-context-menu">
                 <button class="menu-btn menu-btn-info">查看详情</button>
                 <button class="menu-btn menu-btn-default">取消</button>
              </div>`
        },
        handleMenuClick: (target, item) => {
          // console.log(target.innerHTML, target, item)
          if (target.innerHTML === '查看详情') {
            this.$emit('graph-detail', item._cfg.model)
          }
        },
        // offsetX and offsetY include the padding of the parent container
        // 需要加上父级容器的 padding-left 16 与自身偏移量 10
        offsetX: 16 + 10,
        // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
        offsetY: 0,
        // the types of items that allow the menu show up
        // 在哪些类型的元素上响应
        itemTypes: ['node']
      })
      return {
        container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.width, // Number，必须，图的宽度
        height: this.height, // Number，必须，图的高度
        plugins: [grid, minimap, toolbar, contextMenu],
        // 画布渲染后平移浏览器中心
        fitCenter: true,
        // 行为模式
        modes: {
          default: [
            {
              type: 'drag-canvas',
              enableOptimize: true
            },
            'drag-node',
            'zoom-canvas',
            'activate-relations'
          ]
        },
        defaultNode: { type: 'classic-canvas' },
        // 默认边
        defaultEdge: {
          type: 'cubic-vertical',
          style: {
            stroke: '#C5CACF',
            endArrow: {
              path: G6.Arrow.triangle(4, 8, 4.5),
              fill: '#C5CACF',
              d: 8
            }
          },
          labelCfg: {
            autoRotate: true,
            position: 'middle',
            style: {
              fontSize: 8,
              background: {
                padding: [2, 2, 2, 2],
                radius: 2
              },
              opacity: 1
            }
          }
        },
        // nodeStateStyles: {
        //     default: {
        //         stroke: '#DADEE2'
        //     }
        // },
        // 边状态样式
        edgeStateStyles: {
          active: {
            lineWidth: 1,
            stroke: '#3a84ff',
            endArrow: {
              path: G6.Arrow.triangle(4, 8, 4.5),
              fill: '#3a84ff',
              d: 8
            }
          },
          inactive: {
            stroke: '#999',
            opacity: 0.2
          }
        }
      }
    },
    // 获取拓扑数据
    getGraphData(data, dom) {
      const dataConfig = {
        showEdgeLabel: true,
        direction: 'TB'
      }
      return tree.handler(data, dom).getGraphData(dataConfig)
    },
    onGraphEvent() {
      this.graph.on('node:click', _debounce(evt => {
        // 一些操作
        // console.log('click', evt.item._cfg.model)
        this.$emit('graph-click', evt.item._cfg.model)
      }))
    }
  }
}
</script>

<style scoped lang="scss">
  .graph-container {
    width: 100%;
    height: 100%;

    /deep/ .g6-grid-container {
      inset: unset !important;
    }

    /deep/ .graph-mini-map {
      position: absolute;
      z-index: 10;
      right: 0;
      bottom: 0;
      border-top: 1px solid #dcdee2;
      border-left: 1px solid #dcdee2;
      background-color: #fff;
    }

    /deep/ .g6-tooltip {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 10px 8px;
      box-shadow: rgb(174, 174, 174) 0 0 10px;
      z-index: 11;
    }

    /deep/ .graph-tool-bar {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 0;
      border-bottom: 1px solid #dcdee2;
      border-left: 1px solid #dcdee2;
      background-color: #fff;
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      width: 19%;
      padding-top: 7px;
    }
    /deep/ .g6-component-contextmenu{
      z-index: 20 !important;
    }
    /deep/ .graph-context-menu{

    }
    /deep/.menu-btn{
      display: inline-block;
      margin-bottom: 0;
      font-weight: 400;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      height: 32px;
      padding: 0 15px;
      font-size: 14px;
      border-radius: 4px;
      line-height: 1.5;
      outline: 0;
      border:none;
    }
    /deep/.menu-btn-info{
      color: #fff;
      background-color: #57a3f3;
    }
  }
</style>
