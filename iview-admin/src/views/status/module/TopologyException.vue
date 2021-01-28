<template>
  <section class="topology-exception">
    <CwTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :current="page.currentPage"
      :total="page.total"
      :page-size="page.pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="instNameIP" slot-scope="{row}">
        <Tooltip max-width="200" class="w-100" :content="row.inst_name+'/'+row.inst_ip" placement="bottom" transfer>
          <div class="ellipse">{{ row.inst_name+'/'+row.inst_ip }}</div>
        </Tooltip>
      </template>
      <template slot="exception_level" slot-scope="{row}">
        <Button v-if="row.exception_level==='warning'" type="warning" size="small">{{ row.exception_level_cn }}</Button>
        <Button v-else-if="row.exception_level==='danger'" type="error" size="small">{{ row.exception_level_cn }}</Button>
        <Button v-else-if="row.exception_level==='other'" size="small">{{ row.exception_level_cn }}</Button>
        <span v-else />
      </template>
      <template slot="menu" slot-scope="{row}">
        <Button type="primary" size="small" class="mr-10" @click="closeException(row)">关闭</Button>
        <Button size="small" class="mr-10" @click="ignore(row)">忽略</Button>
        <Button type="success" size="small" @click="detail(row)">详情</Button>
      </template>
    </CwTable>
    <Drawer
      v-model="drawerVisible"
      width="50"
      :closable="false"
      placement="right"
      class-name="cw-drawer-wrap"
      :transfer="!fullscreen"
      :inner="fullscreen"
    >
      <ExceptionDetail v-if="drawerVisible" :detail-obj="detailObj" @go-back="goBack" />
    </Drawer>
    <Modal
      key="closeDetail"
      v-model="closeDetail.modalShow"
      class="cw-message-modal"
      width="300"
      :mask-closable="false"
      :transfer="false"
    >
      <div class="text-center">
        <div class="cw-modal-title">
          <span>关闭提示</span>
        </div>
        <div class="mt-10">{{ closeDetail.content }}</div>
        <div class="mt-25">
          <Button style="margin-right: 8px" @click="closeCd('cancel')">取消关闭</Button>
          <Button type="primary" @click="closeCd('yes')">确认关闭</Button>
        </div>
      </div>
    </Modal>
    <Modal
      key="ignoreDetail"
      v-model="ignoreDetail.modalShow"
      class="cw-message-modal"
      width="300"
      :mask-closable="false"
      :transfer="false"
    >
      <div class="text-center">
        <div class="cw-modal-title">
          <span>忽略提示</span>
        </div>
        <div class="mt-10">{{ ignoreDetail.content }}</div>
        <div class="mt-25">
          <Button style="margin-right: 8px" @click="closeIgnoreModal('cancel')">忽略7天</Button>
          <Button type="primary" @click="closeIgnoreModal('yes')">永久忽略</Button>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script>
import CwTable from '@/components/CwTable/CwTable'
import ExceptionDetail from '@/views/show/module/ExceptionDetail'
export default {
  name: 'TopologyException',
  components: { ExceptionDetail, CwTable },
  props: {
    instId: {
      type: String,
      default: () => {
        return ''
      }
    },
    instType: {
      type: String,
      default: () => {
        return ''
      }
    },
    fullscreen: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '业务',
          key: 'app_name',
          align: 'center',
          tooltip: true
        }, {
          title: '异常来源',
          key: 'exception_type_cn',
          align: 'center',
          width: '120px',
          tooltip: true
        }, {
          title: '实例类型',
          key: 'inst_type_cn',
          align: 'center'
        }, {
          title: '实例名称/IP',
          slot: 'instNameIP',
          align: 'center',
          width: '200px'
        }, {
          title: '产生时间',
          key: 'when_generate',
          align: 'center',
          width: '150px'
        }, {
          title: '异常等级',
          slot: 'exception_level',
          align: 'center'
        }, {
          title: '异常描述',
          key: 'exception_describe',
          align: 'center',
          tooltip: true
        }, {
          title: '操作',
          slot: 'menu',
          align: 'center',
          width: '200px'
        }
      ],
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      drawerVisible: false,
      detailObj: null,
      closeDetail: {
        modalShow: false,
        content: '',
        id: ''
      },
      ignoreDetail: {
        modalShow: false,
        content: '忽略后该实例的相同异常将在一段时间内自动屏蔽，您可以在 异常管理-已忽略 页面随时取消忽略。',
        id: ''
      }
    }
  },
  watch: {
    instId(val) {
      // console.log('watch', val)
      this.query()
    }
  },
  created() {
    this.query()
  },
  methods: {
    async query() {
      this.loading = true
      try {
        const res = await this.$api.show.getExceptionByInst({
          inst_id: this.instId,
          inst_type: this.instType,
          num: this.page.pageSize,
          page: this.page.currentPage
        })
        this.loading = false
        if (res.result) {
          this.page.total = res.data.total
          this.data = res.data.data
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.loading = false
        this.$CwMessage('error', e)
      }
    },
    sizeChange(val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.query().then()
    },
    currentChange(val) {
      this.page.currentPage = val
      this.query().then()
    },
    closeException(row) {
      this.closeDetail.modalShow = true
      this.closeDetail.content = `请确认手动关闭${row.inst_ip}(${row.inst_type})于${row.when_generate}出现的异常`
      this.closeDetail.id = row.id
    },
    async closeCd(action) {
      this.closeDetail.modalShow = false
      if (action === 'yes') {
        try {
          const res = await this.$api.show.closeException({ id: this.closeDetail.id })
          if (res.result) {
            this.$CwMessage('success', '关闭成功')
            await this.query()
          } else {
            this.$CwMessage('error', res.message)
          }
        } catch (e) {
          this.$CwMessage('error', e)
        }
      }
    },
    ignore(row) {
      this.ignoreDetail.modalShow = true
      this.ignoreDetail.id = row.id
    },
    async closeIgnoreModal(action) {
      this.ignoreDetail.modalShow = false
      if (action === 'yes') {
        await this.ignoreException({ id: this.ignoreDetail.id, ignore_type: 'seven' })
      }
      if (action === 'cancel') {
        await this.ignoreException({ id: this.ignoreDetail.id, ignore_type: 'forever' })
      }
    },
    async ignoreException(params) {
      try {
        const res = await this.$api.show.ignoreException(params)
        if (res.result) {
          this.$CwMessage('success', '忽略成功')
          await this.query()
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    detail(row) {
      this.detailObj = { ...row }
      this.$nextTick(() => {
        this.drawerVisible = true
      })
    },
    goBack() {
      this.drawerVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .cw-message-modal{

    /deep/.ivu-modal {
      top: 60px;
    }

    /deep/.ivu-modal-close {
      right: 8px;
    }

    /deep/.ivu-modal-footer {
      display: none;
    }
  }
  .cw-modal-title {
    font-size: 20px;
    font-weight: bold;
  }
</style>
