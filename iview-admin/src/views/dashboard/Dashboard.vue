<template>
  <div>
    <h2 class="center">首页</h2>
    <Button type="info" @click="toReport">日报</Button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  methods: {
    toReport() {
      this.$router.push({ name: 'DayReport' })
    }
  }
}
</script>

<style scoped></style>
