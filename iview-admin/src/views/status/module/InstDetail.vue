<template>
  <section class="inst-detail">
    <CwDrawerBody :title="title.replace('<br/>',' | ')" @go-back="goBack">
      <template v-for="(attr,aKey) in instAttr">
        <CwCard :key="attr.bk_property_group+aKey" :title="attr.bk_property_group_name" class="mb-15">
          <Row :gutter="16">
            <i-col v-for="(property,pKey) in attr.bk_property_id_list" :key="property+pKey" span="12" class="mb-5">
              <div class="left-item ellipse text-right">{{ attr.bk_property_name_obj[property]+'：' }}</div>
              <div class="right-item">
                <Tooltip max-width="200">
                  <div slot="content">{{ instDetail[property]||'无' }}</div>
                  <p style="max-width: 170px;" class="ellipse">{{ instDetail[property]||'无' }}</p>
                </Tooltip>
              </div>
            </i-col>
          </Row>
        </CwCard>
      </template>
    </CwDrawerBody>
  </section>
</template>

<script>
import CwDrawerBody from '@/components/CwDrawerBody/CwDrawerBody'
import CwCard from '@/components/CwCard/CwCard'
export default {
  name: 'InstDetail',
  components: { CwCard, CwDrawerBody },
  props: {
    instDetail: {
      type: Object,
      default: () => {
        return []
      }
    },
    instAttr: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    }
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
