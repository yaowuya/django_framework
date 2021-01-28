<template>
  <div v-if="!item.hidden">
    <Dropdown
      ref="dropdown"
      :class="collapsedClasses"
      :transfer-class-name="hideTitle?'collapsed-drop-down':''"
      :transfer="hideTitle"
      :placement="placement"
    >
      <a
        class="drop-menu-a"
        type="text"
        :style="{textAlign: !hideTitle ? 'left' : ''}"
        @mouseover="handleMousemove($event, item.children)"
      >
        <item v-if="item.meta" :icon="item.meta&&item.meta.icon" />
        <span class="menu-title">{{ item.meta.title }}</span>
        <Icon v-if="!hideTitle" style="float: right;" type="ios-arrow-forward" size="16" />
      </a>
      <DropdownMenu v-if="collapsed" ref="dropdown" slot="list">
        <template v-for="child in item.children">
          <template v-if="hasOneShowingChild(child.children,child) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!child.alwaysShow">
            <DropdownItem :key="`drop-${child.name}`" :name="onlyOneChild.name">
              <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <section>
                  <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
                </section>
              </app-link>
            </DropdownItem>
          </template>
          <collapsed-menu
            v-else
            :key="`drop-${child.name}`"
            :item="child"
            :base-path="resolvePath(child.path)"
            :collapsed="collapsed"
          />
        </template>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'
import path from 'path'
import { isExternal } from '@/utils/validate'

export default {
  name: 'CollapsedMenu',
  components: { Item, AppLink },
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
      }
    },
    basePath: {
      type: String,
      default: ''
    },
    collapsed: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      placement: 'right-start'
    }
  },
  computed: {
    collapsedClasses() {
      return this.hideTitle ? '' : 'collapsed-menu-dropdown'
    }
  },
  methods: {
    handleMousemove(event, children) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    },
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
        this.onlyOneChild = { ... parent, noShowingChildren: true }
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

<style scoped>

</style>
