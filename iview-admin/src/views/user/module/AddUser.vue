<template>
  <CwDrawerBody title="添加用户" @go-back="goBack">
    <Form ref="formInline" :model="formInline" inline>
      <FormItem label="用户名" :label-width="60">
        <i-input v-model="formInline.bk_username" placeholder="请输入用户名" clearable />
      </FormItem>
      <FormItem label="中文名" :label-width="60">
        <i-input v-model="formInline.chname" placeholder="请输入中文名" clearable />
      </FormItem>
      <FormItem>
        <Button type="success" @click="query">查询</Button>
      </FormItem>
    </Form>
    <div class="user-table scroll-bar">
      <Table
        :border="true"
        :stripe="true"
        :loading="userLoading"
        :columns="userColumns"
        :data="userData"
        @on-selection-change="selectionChange"
      />
    </div>
    <div class="center mt-20 mb-10">
      <Button type="primary" class="mr-15" @click="save">提交</Button>
      <Button @click="goBack">取消</Button>
    </div>
  </CwDrawerBody>
</template>

<script>
import CwDrawerBody from '@/components/CwDrawerBody/CwDrawerBody'
export default {
  name: 'AddUser',
  components: { CwDrawerBody },
  data() {
    return {
      formInline: {
        bk_username: '',
        chname: ''
      },
      userLoading: false,
      userColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '用户名',
          key: 'bk_username',
          align: 'center'
        }, {
          title: '中文名',
          key: 'chname',
          align: 'center'
        }, {
          title: '用户身份',
          key: 'role',
          align: 'center'
        }
      ],
      userData: [],
      userList: [],
      selectionList: []
    }
  },
  created() {
    this.userData = []
    this.getUserList().then()
  },
  methods: {
    async getUserList() {
      this.userLoading = true
      try {
        const res = await this.$api.sys.getUserList()
        this.userLoading = false
        if (res.result) {
          this.userData = res.data
          this.userList = res.data
        } else {
          this.$CwMessage('success', res.message)
        }
      } catch (e) {
        this.userLoading = false
        this.$CwMessage('error', e)
      }
    },
    query() {
      const result = []
      this.userList.forEach(user => {
        if (user.bk_username.includes(this.formInline.bk_username)) {
          result.push(user)
        }
      })
      const userRes = []
      result.forEach(res => {
        if (res.chname.includes(this.formInline.chname)) {
          userRes.push(res)
        }
      })
      this.userData = userRes
    },
    selectionChange(selection) {
      this.selectionList = [...selection]
    },
    async save() {
      if (this.selectionList.length === 0) {
        this.$CwMessage('warning', '请选择用户')
        return
      }
      this.$Spin.show()
      try {
        const res = await this.$api.sys.addUserList({ userList: this.selectionList })
        this.$Spin.hide()
        if (res.result) {
          this.$emit('go-back', 'save')
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$Spin.hide()
        this.$CwMessage('error', e)
      }
    },
    goBack() {
      this.$emit('go-back')
    }
  }
}
</script>

<style scoped lang="scss">
  .user-table{
    height:calc(100vh - 36vh);
  }
</style>
