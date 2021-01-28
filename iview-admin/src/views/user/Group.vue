<template>
  <section class="group">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem label="组名" :label-width="42">
        <i-input v-model="formInline.group_name" placeholder="请输入组名" clearable />
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
        <Button size="small" class="mr-10" @click="update(row)">编辑</Button>
        <Button type="error" size="small" @click="remove(row)">删除</Button>
      </template>
    </CwTable>
    <Modal v-model="modelVisible" :width="450">
      <p slot="header" class="text-center">
        <span>{{ isAdd ? '添加用户组' : '编辑用户组' }}</span>
      </p>
      <div>
        <Form ref="form" :model="form" :rules="rules" :label-width="80">
          <FormItem label="组名" prop="group_name">
            <i-input v-model="form.group_name" placeholder="请输入组名" clearable />
          </FormItem>
          <FormItem label="用户名" prop="group_users">
            <i-select v-model="form.group_users" filterable multiple clearable>
              <Option v-for="(user,index) in userList" :key="index" :value="user.id">
                {{ user.bk_username+'('+user.chname+')' }}
              </Option>
            </i-select>
          </FormItem>
          <FormItem label="说明" prop="desc">
            <i-input v-model="form.desc" type="textarea" :autosize="{minRows: 2}" placeholder="请输入说明" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="center">
        <Button type="primary" class="mr-15" @click="save">提交</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
  </section>
</template>

<script>
import CwTable from '@/components/CwTable/CwTable'

export default {
  name: 'Group',
  components: { CwTable },
  data() {
    return {
      formInline: {
        group_name: ''
      },
      loading: false,
      columns: [
        {
          title: '组名',
          key: 'group_name',
          align: 'center'
        }, {
          title: '成员',
          key: 'group_users',
          align: 'center',
          tooltip: true
        }, {
          title: '添加时间',
          key: 'group_time',
          align: 'center'
        }, {
          title: '描述',
          key: 'desc',
          align: 'center'
        }, {
          title: '操作',
          slot: 'menu',
          align: 'center',
          width: '150px'
        }
      ],
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      isAdd: true,
      modelVisible: false,
      userList: [],
      form: {
        group_name: '',
        group_users: [],
        desc: ''
      },
      rules: {
        group_name: [
          {
            required: true,
            message: '请输入组名',
            trigger: 'blur'
          }
        ],
        group_users: [
          {
            required: true,
            type: 'array',
            message: '请选择用户',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    Promise.all([this.getAllLocalUser(), this.query()]).then()
  },
  methods: {
    async getAllLocalUser() {
      try {
        const res = await this.$api.sys.getAllLocalUser({})
        if (res.result) {
          this.userList = res.data
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    async search() {
      await this.query()
    },
    async query() {
      this.loading = true
      try {
        const res = await this.$api.sys.getGroup({
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
      this.handleReset('form')
      this.modelVisible = true
      this.isAdd = true
    },
    update(row) {
      this.modelVisible = true
      this.isAdd = false
      this.form = { ...row }
      this.form['group_users'] = JSON.parse(this.form.group_users_id)
    },
    save() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          if (this.isAdd) {
            await this.add()
          } else {
            await this.edit()
          }
        } else {
          this.$CwMessage('error', '请完善资料')
        }
      })
    },
    async add() {
      this.$Spin.show()
      try {
        const res = await this.$api.sys.addGroup({ data: JSON.stringify(this.form) })
        this.$Spin.hide()
        if (res.result) {
          this.modelVisible = false
          this.$CwMessage('success', '添加成功')
          await this.query()
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$Spin.hide()
        this.$CwMessage('error', e)
      }
    },
    async edit() {
      this.$Spin.show()
      try {
        const res = await this.$api.sys.editGroup({ data: JSON.stringify(this.form) })
        this.$Spin.hide()
        if (res.result) {
          this.modelVisible = false
          this.$CwMessage('success', '编辑成功')
          await this.query()
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$Spin.hide()
        this.$CwMessage('error', e)
      }
    },
    cancel() {
      this.modelVisible = false
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
          const res = await this.$api.sys.deleteGroup({ id: row.id })
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
    handleReset(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
