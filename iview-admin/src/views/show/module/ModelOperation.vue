<template>
  <CwDrawerBody :title="title" @go-back="goBack">
    <Form ref="form" :model="form" :rules="rules" :label-width="120">
      <FormItem label="模板名称" prop="model_name">
        <i-input v-model="form.model_name" placeholder="请输入模板名称" clearable :disabled="isStatus" />
      </FormItem>
      <FormItem prop="key_business">
        <span slot="label">
          关键业务
          <Tooltip content="关键业务将在首页固定展示" placement="top">
            <Icon type="ios-help-circle-outline" class="icon-cursor" />
          </Tooltip>
        </span>
        <i-select v-model="form.key_business" filterable multiple clearable @on-change="keyChange">
          <Option v-for="(key,index) in keyBusiness" :key="index" :value="key.bk_biz_name">
            {{ key.bk_biz_name }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem prop="other_business">
        <span slot="label">
          非关键业务
          <Tooltip content="非关键业务将在首页轮播展示" placement="top">
            <Icon type="ios-help-circle-outline" class="icon-cursor" />
          </Tooltip>
        </span>
        <i-select v-model="form.other_business" filterable multiple clearable @on-change="otherChange">
          <Option v-for="(other,index) in otherBusiness" :key="index" :value="other.bk_biz_name">
            {{ other.bk_biz_name }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem label="授权用户" prop="model_users">
        <i-select v-model="form.model_users" multiple clearable>
          <Option v-for="(user,index) in userList" :key="index" :value="user.id">
            {{ user.bk_username+'('+user.chname+')' }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem label="授权用户组" prop="model_groups">
        <i-select v-model="form.model_groups" multiple clearable>
          <Option v-for="(group,index) in groupList" :key="index" :value="group.id">
            {{ group.group_name }}
          </Option>
        </i-select>
      </FormItem>
      <FormItem label="页面结构" prop="page_type">
        <RadioGroup v-model="form.page_type">
          <Radio label="cabinet" class="mr-20">柜式</Radio>
          <Radio label="block">块式</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="说明" prop="desc">
        <i-input v-model="form.desc" type="textarea" :autosize="{minRows: 2}" placeholder="请输入说明" />
      </FormItem>
    </Form>
    <div class="center mb-10 model-footer">
      <Button type="primary" class="mr-15" @click="save">提交</Button>
      <Button @click="goBack">取消</Button>
    </div>
  </CwDrawerBody>
</template>

<script>
import { mapGetters } from 'vuex'
import CwDrawerBody from '@/components/CwDrawerBody/CwDrawerBody'

export default {
  name: 'ModelOperation',
  components: { CwDrawerBody },
  props: {
    isAdd: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    isStatus: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    formObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      title: '添加模板',
      form: {
        model_name: '',
        key_business: [],
        other_business: [],
        model_users: [],
        model_groups: [],
        page_type: 'cabinet',
        desc: ''
      },
      rules: {
        model_name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          }
        ],
        key_business: [
          {
            required: true,
            type: 'array',
            message: '请选择关键业务',
            trigger: 'change'
          }
        ],
        page_type: [
          {
            required: true,
            message: '请选择页面结构',
            trigger: 'change'
          }
        ]
      },
      userList: [],
      groupList: [],
      businessList: [],
      keyBusiness: [],
      otherBusiness: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.$Spin.show()
    Promise.all([
      this.getAllLocalUser(),
      this.getAllGroup(),
      this.getBusinessList()
    ]).then(res => {
      if (this.isStatus) {
        this.title = '模板预览'
      } else {
        this.title = this.isAdd ? '添加模板' : '编辑模板'
      }

      if (!this.isAdd) {
        this.form = { ...this.formObj }
      } else {
        this.form.model_users.push(this.getUserId(this.name))
      }
      this.$Spin.hide()
    }).catch(() => {
      this.$Spin.hide()
    })
  },
  methods: {
    getUserId(userName) {
      let userId = ''
      this.userList.forEach(user => {
        if (userName === user.bk_username) {
          userId = user.id
          return false
        }
      })
      return userId
    },
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
    async getAllGroup() {
      try {
        const res = await this.$api.sys.getAllGroup({})
        if (res.result) {
          this.groupList = res.data
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    async getBusinessList() {
      try {
        const res = await this.$api.show.getBusinessList({})
        if (res.result) {
          this.businessList = res.data
          this.keyBusiness = [...this.businessList]
          this.otherBusiness = [...this.businessList]
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    },
    keyChange(val) {
      if (this.form.key_business.length > 12) {
        this.form.key_business.splice(this.form.key_business.length - 1)
        this.$CwMessage('error', '关键业务不能超过12个')
        return false
      }
      this.otherBusiness = this.businessList.filter(item => {
        if (!val.includes(item.bk_biz_name)) {
          return item
        }
      })
    },
    otherChange(val) {
      this.keyBusiness = this.businessList.filter(item => {
        if (!val.includes(item.bk_biz_name)) {
          return item
        }
      })
    },
    async save() {
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
        const res = await this.$api.show.addModel({ data: JSON.stringify(this.form) })
        this.$Spin.hide()
        if (res.result) {
          this.modelVisible = false
          this.$CwMessage('success', '添加成功')
          this.goBack('add')
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
        const res = await this.$api.show.editModel({ data: JSON.stringify(this.form) })
        this.$Spin.hide()
        if (res.result) {
          this.modelVisible = false
          this.$CwMessage('success', '编辑成功')
          this.goBack('edit')
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$Spin.hide()
        this.$CwMessage('error', e)
      }
    },
    goBack(val) {
      if (val) {
        this.$emit('go-back', val)
      } else {
        this.$emit('go-back')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .model-footer {
      margin-top: 12%;
  }
  .icon-cursor{
    cursor: pointer;
  }
</style>
