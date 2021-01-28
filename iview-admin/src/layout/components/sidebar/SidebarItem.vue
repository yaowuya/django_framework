<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <template v-if="tooltip">
        <Tooltip
          :key="`drop-menu-${item.name}`"
          transfer
          :content="onlyOneChild.meta.title"
          placement="right"
          :disabled="!collapsed"
        >
          <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
            <menu-item :key="`menu-${onlyOneChild.name}`" :name="onlyOneChild.name">
              <section class="menu-item-section">
                <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
              </section>
            </menu-item>
          </app-link>
        </Tooltip>
      </template>
      <template v-else>
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <transition enter-active-class="animated fadeUp" leave-active-class="animated fadeDown">
            <menu-item :key="`menu-${onlyOneChild.name}`" :name="onlyOneChild.name">
              <section class="menu-item-section">
                <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
              </section>
            </menu-item>
          </transition>
        </app-link>
      </template>
    </template>
    <Submenu v-else :name="item.name">
      <template v-if="item.meta" slot="title">
        <collapsed-menu
          class="menu-collapsed-item"
          hide-title
          :item="item"
          :base-path="basePath"
          :collapsed="collapsed"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        v-show="!collapsed"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        :tooltip="false"
        class="nest-menu"
      />
    </Submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import Item from './Item'
import CollapsedMenu from '@/layout/components/sidebar/CollapsedMenu'
export default {
  name: 'SidebarItem',
  components: { CollapsedMenu, Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    tooltip: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    collapsed: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
