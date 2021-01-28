<template>
  <fullscreen ref="fullscreen" @change="fullscreenChange">
    <div class="status-topo">
      <h2 v-show="fullscreen" class="text-center fs-22">业务拓扑</h2>
      <Divider v-show="fullscreen" />
      <Row class="tp-header mb-15" type="flex" justify="space-between">
        <i-col span="14" class="text-left">
          <i-select v-model="form.biz" style="width:250px;" class="mr-10" @on-change="bizChange">
            <Button slot="prefix" type="primary" class="select-prefix-btn">业务</Button>
            <Option v-for="(biz,index) in businessList" :key="index" :value="biz.bk_biz_id">
              {{ biz.bk_biz_name }}
            </Option>
          </i-select>
          <i-select
            v-model="form.set"
            multiple
            style="width:350px;"
            :max-tag-count="2"
            @on-change="setChange"
            @on-select="setSelect"
          >
            <Button slot="prefix" type="primary" class="select-prefix-btn">集群</Button>
            <Option v-for="(set,index) in setList" :key="index" :value="set.bk_set_id">
              {{ set.bk_set_name }}
            </Option>
          </i-select>
        </i-col>
        <i-col span="10" class="tp-header-icon">
          <Tooltip v-show="!fullscreen" content="拉取拓扑图数据" placement="top" class="mr-10">
            <Icon type="md-refresh" @click="refreshTopology" />
          </Tooltip>
          <Tooltip v-show="!fullscreen" content="初始化数据" placement="top" class="mr-10">
            <Icon type="md-infinite" @click="initData" />
          </Tooltip>
          <Tooltip v-show="!fullscreen" content="返回" placement="top" class="mr-10">
            <Icon type="ios-undo" @click="backHome" />
          </Tooltip>
          <Tooltip content="全屏" placement="top">
            <Icon type="md-expand" @click="toggle" />
          </Tooltip>
        </i-col>
      </Row>
      <div id="graph-area" class="graph-area">
        <Graph
          v-if="isDrawGraph"
          :key="'graph'+uuid"
          :graph-data="graphData"
          @graph-click="graphClick"
          @graph-detail="graphDetail"
        />
      </div>
      <TopologyException
        :key="'topo'+uuid"
        class="mt-15"
        :inst-id="exParams.inst_id"
        :inst-type="exParams.inst_type"
        :fullscreen="fullscreen"
      />
      <section :key="'inst'+uuid">
        <Drawer
          v-model="drawerVisible"
          :transfer="!fullscreen"
          :inner="fullscreen"
          width="50"
          :closable="false"
          placement="right"
          class-name="cw-drawer-wrap"
        >
          <InstDetail
            v-if="drawerVisible"
            :title="detailObj.title"
            :inst-detail="detailObj.instDetail"
            :inst-attr="detailObj.instAttr"
            @go-back="goBack"
          />
        </Drawer>
      </section>
      <Spin v-if="spinLoading" size="large" fix />
    </div>
  </fullscreen>

</template>

<script>
import Graph from '@/graph/Graph'
import TopologyException from '@/views/status/module/TopologyException'
import InstDetail from '@/views/status/module/InstDetail'

export default {
  name: 'Topology',
  components: {
    InstDetail,
    TopologyException,
    Graph
  },
  data() {
    return {
      spinLoading: false,
      fullscreen: false,
      form: {
        biz: '',
        set: []
      },
      setObj: {
        init: false,
        oldSet: [],
        newOption: ''
      },
      businessList: [],
      setList: [{
        bk_set_id: 100000,
        bk_set_name: '所有'
      }],
      defaultSet: {
        bk_set_id: 100000,
        bk_set_name: '所有'
      },
      isDrawGraph: false,
      graphData: {},
      uuid: this.$uuid.v4(),
      exParams: {
        inst_id: '',
        inst_type: ''
      },
      drawerVisible: false,
      detailObj: {
        title: '',
        instDetail: [],
        instAttr: []
      },
      timerCircle: null
    }
  },
  created() {
    // console.log(this.$route.params)
    this.form.biz = this.$route.params.bk_biz_id || ''
    this.bizChange(this.form.biz, 'created')
  },
  mounted() {
    this.$Spin.show()
    Promise.all([
      this.getBusinessList(),
      this.getTopologyData()
    ]).then(res => {
      this.drawGraph()
      this.$Spin.hide()
      this.setCircle()
    }).catch(() => {
      this.$Spin.hide()
    })
  },
  destroyed() {
    if (this.timerCircle) {
      window.clearInterval(this.timeCircle)
    }
  },
  methods: {
    toggle() {
      this.$refs['fullscreen'].toggle() // recommended
      // this.fullscreen = !this.fullscreen // deprecated
    },
    backHome() {
      this.$router.push({ name: 'Home' })
    },
    async refreshTopology() {
      await this.getTopologyData()
      // this.isDrawGraph = false
      this.$nextTick(() => {
        this.uuid = this.$uuid.v4()
      })
    },
    async initData() {
      try {
        const res = await this.$api.topo.initCMDBData({})
        if (res.result) {
          this.$CwMessage('success', '初始化成功')
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen
      this.uuid = this.$uuid.v4()
    },
    async getTopologyData() {
      try {
        let bk_biz_name = ''
        if (this.businessList.length > 0) {
          this.businessList.forEach(biz => {
            if (biz.bk_biz_id === this.form.biz) {
              bk_biz_name = biz.bk_biz_name
              return false
            }
          })
        } else {
          bk_biz_name = this.$route.params.bk_biz_name || ''
        }

        if (bk_biz_name === '') {
          this.$CwMessage('error', '请选择业务')
          return
        }

        const bk_set = this.form.set.indexOf(this.defaultSet.bk_set_id) >= 0 ? this.defaultSet.bk_set_id : this.form.set
        this.spinLoading = true
        const res = await this.$api.topo.getTopologyData({
          bk_biz_id: this.form.biz,
          bk_biz_name: bk_biz_name,
          set: JSON.stringify(bk_set)
        })
        if (res.result) {
          this.graphData = res.data
          this.spinLoading = false
        } else {
          this.spinLoading = false
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    setCircle() {
      if (this.timerCircle) {
        window.clearInterval(this.timeCircle)
      }
      this.timerCircle = window.setInterval(async() => {
        await this.getTopologyData()
      }, 1000 * 60 * 3)
    },
    async getBusinessList() {
      try {
        const res = await this.$api.show.getBusinessList({})
        if (res.result) {
          this.businessList = res.data
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    async bizChange(bk_biz_id, params) {
      this.form.set = [this.defaultSet.bk_set_id]
      await this.getSetList(bk_biz_id)
      if (!params) {
        await this.getTopologyData()
      }

      // this.isDrawGraph = false
      this.$nextTick(() => {
        this.uuid = this.$uuid.v4()
      })
    },
    async getSetList(bk_biz_id) {
      try {
        const res = await this.$api.topo.getSetList({ bk_biz_id: bk_biz_id })
        if (res.result) {
          this.setList = res.data
          this.setList.splice(0, 0, this.defaultSet)
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    setSelect(setItem) {
      this.setObj.init = true
      this.setObj.oldSet = [...this.form.set]
      this.setObj.newOption = setItem.value
    },
    async setChange(bk_set_id) {
      if (this.setObj.oldSet.includes(this.defaultSet.bk_set_id)) {
        if (this.setObj.newOption !== this.defaultSet.bk_set_id) {
          this.form.set.splice(this.form.set.findIndex(v => v === this.defaultSet.bk_set_id), 1)
          this.setObj.oldSet = []
        }
      } else {
        if (this.setObj.newOption === this.defaultSet.bk_set_id) {
          this.form.set = [this.defaultSet.bk_set_id]
        }
      }
      if (this.setObj.init) {
        await this.getTopologyData()
      }

      // this.isDrawGraph = false
      this.$nextTick(() => {
        this.uuid = this.$uuid.v4()
      })
    },
    drawGraph() {
      this.isDrawGraph = true
    },
    graphClick(node) {
      // console.log('click', node)
      const { bk_id, bk_type, level } = node
      if (level === 3 || level === 4) {
        this.exParams.inst_id = bk_id
        this.exParams.inst_type = bk_type
      }
    },
    async graphDetail(item) {
      // console.log('graphDetail', item)
      try {
        const { bk_type, bk_id } = item
        const res = await this.$api.topo.getInstDetailInfo({
          bk_type,
          bk_id
        })
        if (res.result) {
          this.detailObj.title = item.desc
          this.detailObj.instDetail = res.instDetail
          this.detailObj.instAttr = res.instAttr
          this.drawerVisible = true
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    goBack() {
      this.drawerVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/mixin.scss";

  .fullscreen .status-topo {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    @include scrollBar;
  }

  .tp-header {
    /deep/ .ivu-select-prefix {
      padding-left: 0 !important;
    }

    /deep/ .ivu-select-multiple .ivu-select-selection {
      padding: 0 24px 0 0 !important;
    }

    .select-prefix-btn {
      border: none !important;
      border-radius: 4px 0 0 4px !important;
      height: 30px !important;
    }

    .tp-header-icon {
      text-align: right;

      .ivu-icon {
        font-size: 22px;
        cursor: pointer;
      }
    }
  }

  .graph-area {
    position: relative;
    z-index: 1;
    border: 1px solid #dcdee2;
    width: 100%;
    height: 60vh;
  }

  .cw-drawer-wrap {
    z-index: 1000 !important;
  }
</style>
