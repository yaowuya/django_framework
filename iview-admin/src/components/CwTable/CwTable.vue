<template>
  <section class="cw-table">
    <Table
      :border="border"
      :stripe="stripe"
      :loading="loading"
      :columns="columns"
      :data="data"
      :size="size"
    >
      <template v-for="col in columns" :slot="col.slot" slot-scope="{row,index}">
        <span v-if="!col.slot" :key="row[col.key]">{{ row[col.key] }}</span>
        <slot v-else :name="col.slot" :row="row" :index="index" />
      </template>
    </Table>
    <div class="cw-table-page">
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
    </div>
  </section>
</template>

<script>
export default {
  name: 'CwTable',
  props: {
    border: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    stripe: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    size: {
      type: String,
      default: () => {
        return 'small'
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
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
  data() {
    return {
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
   .cw-table-page{
     text-align: right;
     margin-top: 12px;
   }
</style>
