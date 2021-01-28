<template>
  <section class="not-close-exception">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem label="业务" :label-width="40">
        <i-input v-model="formInline.app_name" placeholder="请输入业务名称" clearable />
      </FormItem>
      <FormItem label="异常来源" :label-width="70">
        <i-select
          v-model="formInline.exception_type"
          multiple
          clearable
          placeholder="请选择异常来源"
          style="width: 15vw;"
          :max-tag-count="2"
        >
          <Option v-for="(exception,index) in exceptionList" :key="index" :value="exception.value">
            {{ exception.name }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem label="实例类型" :label-width="70">
        <i-select
          v-model="formInline.inst_type"
          multiple
          clearable
          placeholder="请选择实例类型"
          style="width: 12vw;"
        >
          <Option v-for="(type,index) in instTypeList" :key="index" :value="type.value">
            {{ type.name }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem label="实例名称" :label-width="70">
        <i-input v-model="formInline.inst_name" placeholder="请输入实例名称" clearable />
      </FormItem>
      <FormItem>
        <Button type="success" class="mr-15" @click="search">查询</Button>
      </FormItem>
    </Form>
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
      <template slot="close_type" slot-scope="{row}">
        <span>{{ row.close_type_cn }}</span>
      </template>
      <template slot="menu" slot-scope="{row}">
        <Button type="success" size="small" @click="detail(row)">详情</Button>
      </template>
    </CwTable>
    <Drawer
      v-model="drawerVisible"
      width="50"
      :closable="false"
      placement="right"
      class-name="cw-drawer-wrap"
    >
      <ExceptionDetail v-if="drawerVisible" :detail-obj="detailObj" @go-back="goBack" />
    </Drawer>
  </section>
</template>

<script>
import CwTable from '@/components/CwTable/CwTable'
import ExceptionDetail from '@/views/show/module/ExceptionDetail'
export default {
  name: 'CloseException',
  components: { ExceptionDetail, CwTable },
  props: {
    exceptionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    instTypeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      formInline: {
        app_name: '',
        exception_type: [],
        inst_type: [],
        inst_name: ''
      },
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
          tooltip: true,
          align: 'center'
        }, {
          title: '关闭方式',
          slot: 'close_type',
          align: 'center',
          tooltip: true
        }, {
          title: '操作',
          slot: 'menu',
          align: 'center',
          width: '100px'
        }
      ],
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      drawerVisible: false,
      detailObj: null
    }
  },
  created() {
    this.query().then()
  },
  methods: {
    async search() {
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.show.getException({
          params: this.formInline,
          isClose: true,
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

<style scoped>

</style>

