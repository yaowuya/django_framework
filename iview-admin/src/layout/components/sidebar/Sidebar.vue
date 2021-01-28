<template>
  <div>
    <Menu
      ref="menu"
      :active-name="activeName"
      :theme="theme"
      width="auto"
      :open-names="openedNames"
      :accordion="accordion"
      :class="menuitemClasses"
      @on-open-change="onOpenChange"
    >
      <sidebar-item v-for="route in menuList" :key="route.path" class="side-item" :item="route" :base-path="route.path" :collapsed="collapsed" />
    </Menu>
  </div>
</template>

<script>
import { constantRoutes } from '@/router'
import SidebarItem from '@/layout/components/sidebar/SidebarItem'
import { getUnion } from '@/utils/tools'
import { homeName } from '@/settings'
export default {
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    collapsed: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      openNames: [],
      openedNames: [],
      accordion: false,
      theme: 'light',
      rootIconSize: 20,
      iconSize: 16,
      menuList: constantRoutes
    }
  },
  computed: {
    menuitemClasses() {
      return [
        'menu-item',
        this.collapsed ? 'collapsed-menu' : ''
      ]
    },
    activeName: {
      get() {
        const route = this.$route
        const { meta, name } = route
        this.activeOpen(name)
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return name
      },
      set(newValue) {
        return newValue
      }
    }
  },
  watch: {
    openNames(newNames) {
      this.openedNames = newNames
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    },
    collapsed(newValue) {
      if (newValue) {
        this.updateOpenName(this.activeName)
      }
    }
  },
  created() {
    // this.activeName = this.activeMenu
  },
  mounted() {
    this.openedNames = getUnion(
      this.openedNames,
      this.getOpenedNamesByActiveName(name)
    )
  },
  methods: {
    getActiveName() {

    },
    activeOpen(name) {
      if (this.accordion) {
        this.openedNames = this.getOpenedNamesByActiveName(name)
      } else {
        if (this.collapsed) {
          this.updateOpenName(name)
        }
      }
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName(name) {
      if (name === homeName) {
        this.openedNames = []
      } else {
        this.openedNames = this.getOpenedNamesByActiveName(name)
      }
    },
    onOpenChange(value) {
      if (this.collapsed) {
        this.updateOpenName(this.activeName)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/.ivu-menu-vertical.ivu-menu-light:after{
    width: 0 !important;
  }
</style>
