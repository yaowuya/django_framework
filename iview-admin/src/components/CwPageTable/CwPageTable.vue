<template>
  <section class="page-table">
    <slot />
    <div class="page-component">
      <CwPage v-bind="$props" v-on="$listeners" />
    </div>
  </section>
</template>

<script>
import CwPage from '@/components/CwPage/CwPage'
export default {
  name: 'CwPageTable',
  components: { CwPage },
  props: {
    ...CwPage.props,
    total: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  method: {

  }
}
</script>

<style scoped lang="scss">
  .page-component{
    text-align: right;
    margin-top: 10px;
  }
</style>
