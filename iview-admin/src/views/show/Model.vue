<template>
  <section class="show-model">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem label="模板名称" :label-width="70">
        <i-input v-model="formInline.model_name" placeholder="请输入模板名称" clearable />
      </FormItem>
      <FormItem>
        <Button type="success" class="mr-15" @click="search">查询</Button>
        <Button type="primary" @click="create">添加</Button>
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
      <template slot="menu" slot-scope="{row}">
        <Button type="primary" size="small" class="mr-10" @click="previewModel(row)">浏览</Button>
        <Button type="warning" size="small" class="mr-10" :disabled="row.default" @click="setDefault(row)">设为默认</Button>
        <Button size="small" class="mr-10" @click="update(row)">编辑</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </CwTable>
    <Drawer
      v-model="drawerVisible"
      width="50"
      :closable="false"
      placement="right"
      class-name="cw-drawer-wrap"
    >
      <ModelOperation :key="uuid" :is-add="isAdd" :form-obj="formObj" @go-back="goBack" />
    </Drawer>
  </section>
</template>

<script>
import CwTable from '@/components/CwTable/CwTable'
import ModelOperation from '@/views/show/module/ModelOperation'
export default {
  name: 'Model',
  components: { ModelOperation, CwTable },
  data() {
    return {
      formInline: {
        model_name: ''
      },
      loading: false,
      columns: [
        {
          title: '模板名称',
          key: 'model_name',
          align: 'center'
        }, {
          title: '授权用户',
          key: 'model_users',
          align: 'center',
          tooltip: true
        }, {
          title: '授权用户组',
          key: 'model_groups',
          align: 'center',
          tooltip: true
        }, {
          title: '创建时间',
          key: 'create_time',
          align: 'center',
          tooltip: true
        }, {
          title: '创建人',
          key: 'create_user',
          align: 'center'
        }, {
          title: '描述',
          key: 'desc',
          align: 'center'
        }, {
          title: '操作',
          slot: 'menu',
          align: 'center',
          width: '300px'
        }
      ],
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      isAdd: true,
      drawerVisible: false,
      uuid: '',
      formObj: {}
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
        const res = await this.$api.show.getAllModel({
          params: this.formInline,
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
    async create() {
      this.uuid = this.$uuid.v4()
      this.$nextTick(() => {
        this.isAdd = true
        this.drawerVisible = true
      })
    },
    update(row) {
      this.uuid = this.$uuid.v4()
      this.$nextTick(() => {
        this.isAdd = false
        this.formObj = { ...row }
        this.formObj['key_business'] = this.formObj.key_business.split(';')
        this.formObj['other_business'] = this.formObj.other_business.split(';')
        this.formObj['model_users'] = JSON.parse(this.formObj.model_user_list)
        this.formObj['model_groups'] = JSON.parse(this.formObj.model_group_list)
        this.drawerVisible = true
      })
    },
    previewModel(row) {
      this.$router.push({ name: 'Dashboard', params: { id: row.id }})
    },
    setDefault(row) {
      this.$CWConfirm({
        type: 'warning',
        title: '设为默认',
        content: '是否设置这个模板为默认模板',
        okText: '确定',
        cancelText: '取消'
      }).then(async() => {
        try {
          const res = await this.$api.show.setDefaultModel({ id: row.id })
          if (res.result) {
            this.$CwMessage('success', '设置成功')
            await this.query()
          } else {
            this.$CwMessage('error', res.message)
          }
        } catch (e) {
          this.$CwMessage('error', e)
        }
      }).catch(() => {

      })
    },
    remove(row) {
      this.$CWConfirm({
        type: 'error',
        title: '删除',
        content: '是否删除这条数据',
        okText: '删除',
        cancelText: '取消'
      }).then(async() => {
        try {
          const res = await this.$api.show.deleteModel({ id: row.id })
          if (res.result) {
            this.$CwMessage('success', '删除成功')
            await this.query()
          } else {
            this.$CwMessage('error', res.message)
          }
        } catch (e) {
          this.$CwMessage('error', e)
        }
      }).catch(() => {

      })
    },
    goBack(val) {
      if (val) {
        this.query().then()
      }
      this.drawerVisible = false
    }
  }
}
</script>

<style scoped>

</style>
