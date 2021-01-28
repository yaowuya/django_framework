<template>
  <section class="user-group">
    <Tabs value="user" @on-click="tabChange">
      <TabPane label="用户" name="user">
        <User />
      </TabPane>
      <TabPane label="用户组" name="group">
        <Group :key="uuid" />
      </TabPane>
    </Tabs>
  </section>
</template>

<script>
import User from '@/views/user/User'
import Group from '@/views/user/Group'
export default {
  name: 'UserGroup',
  components: { Group, User },
  data() {
    return {
      uuid: this.$uuid.v4()
    }
  },
  methods: {
    tabChange(name) {
      if (name === 'group') {
        this.uuid = this.$uuid.v4()
      }
    }
  }
}
</script>

<style scoped lang="scss">
   .user-group{
     margin-top: -20px;
   }
</style>
