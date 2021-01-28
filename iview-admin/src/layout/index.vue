<template>
  <div class="app-mapper">
    <Layout class="app-layout">
      <Header class="header">
        <NavBar />
      </Header>
      <Layout>
        <Sider
          ref="sideBar"
          v-model="collapsed"
          class="sidebar-container"
          hide-trigger
          collapsible
          :width="210"
          :collapsed-width="64"
        >
          <Sidebar ref="sideBarMenu" :collapsed="collapsed" />
        </Sider>
        <Layout class="content" :class="leftMenu">
          <div class="content-header">
            <Icon class="content-header-icon" :class="rotateIcon" type="md-menu" size="24" @click.native="collapsedSideBar" />
            <BreadcrumbCom class="bread-crumb" />
          </div>
          <AppMain />
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import Sidebar from '@/layout/components/sidebar/Sidebar'
import AppMain from '@/layout/components/AppMain'
import BreadcrumbCom from '@/components/BreadcrumbCom/index'
import { mapActions } from 'vuex'

export default {
  components: { BreadcrumbCom, AppMain, Sidebar, NavBar },
  data() {
    return {
      collapsed: false
    }
  },
  computed: {
    rotateIcon() {
      return [
        'menu-icon',
        this.collapsed ? 'rotate-icon' : ''
      ]
    },
    leftMenu() {
      return [
        this.collapsed ? 'close-menu' : 'open-menu'
      ]
    }
  },
  methods: {
    ...mapActions('app', ['toggleCollapse']),
    collapsedSideBar() {
      this.$refs.sideBar.toggleCollapse()
      this.$nextTick(() => {
        this.toggleCollapse(this.collapsed)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "@/styles/mixin.scss";

  .app-mapper {
    @include clearfix;
    @include relative;
    overflow: hidden;
  }
</style>
