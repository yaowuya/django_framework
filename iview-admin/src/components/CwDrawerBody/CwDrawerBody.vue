<template>
  <div class="drawer-body">
    <CwDrawerHeader :title="title" @go-back="goBack()" />
    <div class="app-container">
      <slot />
    </div>
  </div>
</template>
<!--
组件描述：封装常用的抽屉，头部包含标题和返回按钮，内容自定义，内容超出页面高度，有滚动条
参数：
   title：必填，抽屉标题
方法:
    go-back:返回函数
-->
<script>
import CwDrawerHeader from '@/components/CwDrawerHeader/CwDrawerHeader'
export default {
  name: 'CwDrawerBody',
  components: { CwDrawerHeader },
  props: {
    title: {
      type: String,
      required: true
    }
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
