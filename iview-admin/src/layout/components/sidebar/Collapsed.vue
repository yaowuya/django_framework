<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <Tooltip
        :key="`drop-menu-${item.name}`"
        transfer
        :content="onlyOneChild.meta.title"
        placement="right"
      >
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
          <a class="drop-menu-a" :style="{ textAlign: 'center' }">
            <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" />
          </a>
        </app-link>
      </Tooltip>
    </template>
    <collapsed-menu
      v-else
      hide-title
      :item="item"
      :base-path="basePath"
    />
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import CollapsedMenu from './CollapsedMenu'

export default {
  name: 'Collapsed',
  components: { CollapsedMenu, Item, AppLink },
  props: {
    item: {
      type: Object,
      default: () => {
      }
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
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
        this.onlyOneChild = {
          ...parent,
          path: '',
          noShowingChildren: true
        }
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
