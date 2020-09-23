<template>
<div class="sidebar-container">
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      unique-opened
      router
      :collapse="$store.state.collapse">
      <sidebar-item v-for="(menu, index) in menuList" :key="'menu'+index" :menuItem="menu"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</div>
</template>

<script>
import navMenu from '@/views/pages/index.js'
import sidebarItem from './sidebarItem'
export default {
  components: {
    sidebarItem
  },
  data () {
    return {
      menuList: this.deal(navMenu)
    }
  },
  computed: {

  },
  methods: {
    // 过滤树形结构数据中不符合条件路由(hidden为true)
    deal (arr) {
      if (!arr || arr.length === 0) return []
      let newData = []
      arr.forEach(v => {
        if (!v.hidden) {
          newData.push(v)
          v.children = this.deal(v.children)
        } else {
          // 如果父节点不满足条件,则其子节点全部过滤掉
          // newData.push(...this.deal(v.children))
        }
      })
      return newData
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar-container {
  flex: 1;
  position: relative;
}
</style>
