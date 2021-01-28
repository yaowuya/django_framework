<template>
  <Content class="app-main">
    <router-view :key="key" />
  </Content>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">

</style>
