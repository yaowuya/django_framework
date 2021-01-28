<template>
  <section class="user">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem label="用户名" :label-width="55">
        <i-input v-model="formInline.bk_username" placeholder="请输入用户名" clearable />
      </FormItem>
      <FormItem label="中文名" :label-width="60">
        <i-input v-model="formInline.chname" placeholder="请输入中文名" clearable />
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
      <AddUser :key="uuid" @go-back="goBack" />
    </Drawer>
  </section>
</template>

<script>
import CwTable from '@/components/CwTable/CwTable'
import AddUser from '@/views/user/module/AddUser'

export default {
  name: 'User',
  components: {
    AddUser,
    CwTable
  },
  data() {
    return {
      formInline: {
        bk_username: '',
        chname: ''
      },
      loading: false,
      columns: [
        {
          title: '用户名',
          key: 'bk_username',
          align: 'center'
        }, {
          title: '中文名',
          key: 'chname',
          align: 'center'
        }, {
          title: '邮箱',
          key: 'email',
          align: 'center',
          width: '220px'
        }, {
          title: '手机号',
          key: 'phone',
          align: 'center'
        }, {
          title: '用户身份',
          key: 'role',
          align: 'center'
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
      uuid: this.$uuid.v4()
    }
  },
  created() {
    this.query().then()
  },
  methods: {
    async create() {
      this.uuid = this.$uuid.v4()
      this.drawerVisible = true
    },
    async search() {
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.sys.getAllUserList({
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
    remove(row) {
      this.$CWConfirm({
        type: 'error',
        title: '删除',
        content: '是否删除这条数据',
        okText: '删除',
        cancelText: '取消'
      }).then(async() => {
        try {
          const res = await this.$api.sys.deleteUserById({ id: row.id })
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

<style scoped lang="scss">
</style>
