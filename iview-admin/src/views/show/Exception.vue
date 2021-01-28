<template>
  <section class="show-exception">
    <Tabs value="notCloseException" @on-click="tabChange">
      <TabPane label="未关闭异常" name="notCloseException">
        <NotCloseException :exception-list="exceptionList" :inst-type-list="instTypeList" />
      </TabPane>
      <TabPane label="已关闭异常" name="closeException">
        <CloseException :key="uuid" :exception-list="exceptionList" :inst-type-list="instTypeList" />
      </TabPane>
    </Tabs>
  </section>
</template>

<script>
import NotCloseException from '@/views/show/NotCloseException'
import CloseException from '@/views/show/CloseException'
export default {
  name: 'Exception',
  components: { CloseException, NotCloseException },
  data() {
    return {
      exceptionList: [{
        name: '告警',
        value: 'alert'
      }, {
        name: '巡检',
        value: 'check'
      }, {
        name: '备份',
        value: 'backup'
      }, {
        name: '补丁',
        value: 'patch'
      }, {
        name: '基线',
        value: 'baseline'
      }, {
        name: '证书',
        value: 'ssl'
      }],
      instTypeList: [{
        name: '主机',
        value: 'host'
      }, {
        name: 'MySQL',
        value: 'mysql'
      }],
      uuid: ''
    }
  },
  methods: {
    tabChange(name) {
      if (name === 'closeException') {
        this.uuid = this.$uuid.v4()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .show-exception{
    margin-top: -20px;
  }
</style>
