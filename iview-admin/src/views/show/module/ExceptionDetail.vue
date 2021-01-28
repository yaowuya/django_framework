<template>
  <section class="exception-detail">
    <CwDrawerBody :title="detailObj.inst_name+'/'+detailObj.inst_ip +' 详情信息'" @go-back="goBack">
      <CwCard title="基础信息" class="mb-15">
        <Row :gutter="16">
          <i-col v-for="(base,index) in baseItem" :key="index" span="12" class="mb-5">
            <div class="left-item ellipse text-right">{{ base.label+'：' }}</div>
            <div class="right-item">
              <!--              {{ detailObj[base.value]||'无' }}-->
              <Tooltip max-width="200">
                <div slot="content">{{ detailObj[base.value]||'无' }}</div>
                <p style="max-width: 170px;" class="ellipse">{{ detailObj[base.value]||'无' }}</p>
              </Tooltip>
            </div>
          </i-col>
        </Row>
      </CwCard>
      <CwCard title="详细信息">
        <Row :gutter="16">
          <i-col v-for="(base,index) in detailObj.exception_detail_data" :key="index" span="12" class="mb-5">
            <div class="left-item ellipse text-right">{{ base.label+'：' }}</div>
            <div class="right-item">
              <!--              {{ detailObj[base.value]||'无' }}-->
              <Tooltip max-width="200">
                <div slot="content">{{ base.value||'无' }}</div>
                <p style="max-width: 170px;" class="ellipse">{{ base.value||'无' }}</p>
              </Tooltip>
            </div>
          </i-col>
        </Row>
      </CwCard>
    </CwDrawerBody>
  </section>
</template>

<script>
import CwDrawerBody from '@/components/CwDrawerBody/CwDrawerBody'
import CwCard from '@/components/CwCard/CwCard'

export default {
  name: 'ExceptionDetail',
  components: {
    CwCard,
    CwDrawerBody
  },
  props: {
    detailObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      baseItem: [{
        label: '异常来源',
        value: 'exception_type_cn'
      }, {
        label: '异常产生时间',
        value: 'when_generate'
      }, {
        label: '实例IP',
        value: 'inst_ip'
      }, {
        label: '异常描述',
        value: 'exception_describe'
      }, {
        label: '异常关闭时间',
        value: 'ignore_time'
      }, {
        label: '异常关闭方式',
        value: 'close_type_cn'
      }, {
        label: '异常关闭操作者',
        value: 'exception_operator'
      }]
    }
  },
  created() {

  },
  methods: {
    goBack() {
      this.$emit('go-back')
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .cw-card-header:hover {
    color: #2d8cf0;
  }

  .left-item {
    width: 40%;
    float: left;
  }

  .right-item {
    width: 60%;
    float: right;
    cursor: pointer;
  }
</style>
