<template>
  <div class="drawer-header">
    <div class="back" @click.stop="goBack()">
      <Icon type="ios-arrow-forward" />
    </div>
    <p class="header-p">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'CwDrawerHeader',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$emit('go-back')
    }
  }
}
</script>

<style scoped>

</style>
