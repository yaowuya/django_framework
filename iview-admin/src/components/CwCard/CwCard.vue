<template>
  <Card :bordered="bordered" :dis-hover="disHover" :shadow="shadow">
    <div slot="title" class="cw-card-header" @click="clickIcon">
      <div class="cw-card-icon">
        <Icon v-show="!close" type="ios-arrow-down" />
        <Icon v-show="close" type="ios-arrow-up" />
      </div>
      {{ title }}
    </div>
    <div v-show="!close" class="cw-card-content">
      <slot />
    </div>
  </Card>
</template>

<script>
/*
  组件描述：封装element的card组件，新增了可以隐藏和展开卡片内容的功能
  参数：
  shadow:card组件原有的参数
  title:card组件原有的参数
  isDown:用于隐藏或展开卡片内容的参数，默认是true
*/
export default {
  name: 'CwCard',
  props: {
    title: {
      type: String,
      default: () => {
        return '标题'
      }
    },
    bordered: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    disHover: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    shadow: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isClose: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      close: false
    }
  },
  created() {
    this.close = this.isClose
  },
  methods: {
    clickIcon() {
      this.close = !this.close
    }
  }
}
</script>

<style scoped lang="scss">
  .cw-card-header{
    cursor: pointer;
    .cw-card-icon{
      display: inline-block;
      cursor: pointer;
    }
  }

</style>
