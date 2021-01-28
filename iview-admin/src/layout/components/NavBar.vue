<template>
  <div class="nav-bar">
    <Row type="flex" justify="space-between">
      <i-col span="8">
        <div class="layout-logo">
          <div class="logo">
            <router-link to="/">
              <img :key="logo" :src="logo" class="img-logo" alt="嘉为蓝鲸">
            </router-link>
          </div>
          <div class="title">
            <router-link to="/">
              <span>{{ title }}</span>
            </router-link>
          </div>
        </div>
      </i-col>
      <i-col span="4">
        <div class="right-menu">
          <Dropdown transfer @on-click="handleClick">
            <a href="javascript:void(0)">
              {{ name }}
              <Icon type="ios-arrow-down" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { title } from '@/settings'

export default {
  name: 'NavBar',
  data() {
    return {
      title: title
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'logo'
    ])
  },
  methods: {
    logout() {
      console.log('logout')
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/styles/mixin.scss";

  .nav-bar {
    @include relative;
    .layout-logo{
      display: flex;
      align-items: center;
      height: 64px;

      .logo{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 32px;
        margin:16px 25px 0 10px;
        .img-logo {
          object-fit: scale-down;
          width: 100%;
          height: 100%;
        }
      }

      .title {
        padding-top: 5px;
        span {
          color: #399cff;
          font-size: 22px;
        }
      }
    }

    .right-menu {
      height: 64px;
      float: right;
    }
  }
</style>
