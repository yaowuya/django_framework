<template>
  <section class="cw-page">
    <Page
      :current="current"
      :total="total"
      :show-total="showTotal"
      :show-sizer="showSizer"
      :prev-text="prevText"
      :next-text="nextText"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      show-elevator
      @on-change="onChange"
      @on-page-size-change="onPageSizeChange"
    />
  </section>
</template>

<script>
export default {
  name: 'CwPage',
  props: {
    current: {
      type: Number,
      default: () => {
        return 1
      }
    },
    total: {
      type: Number,
      default: () => {
        return 0
      }
    },
    showTotal: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    showSizer: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    pageSize: {
      type: Number,
      default: () => {
        return 10
      }
    },
    pageSizeOpts: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40]
      }
    },
    prevText: {
      type: String,
      default: () => {
        return '上一页'
      }
    },
    nextText: {
      type: String,
      default: () => {
        return '下一页'
      }
    }
  },
  methods: {
    onChange(currentPage) {
      this.$emit('current-change', currentPage)
    },
    onPageSizeChange(pageSize) {
      this.$emit('size-change', pageSize)
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.ivu-page-total {
    vertical-align: bottom;
  }
</style>
