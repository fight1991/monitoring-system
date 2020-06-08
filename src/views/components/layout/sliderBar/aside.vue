<template>
<div class="sidebar-container">
  <span class="pull-button left" @click="toggleMenu" v-if="!$store.state.collapse">
    <i class="el-icon-arrow-left"></i>
  </span>
  <span class="pull-button right" @click="toggleMenu" v-else>
    <i class="el-icon-arrow-right"></i>
  </span>
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
    toggleMenu () {
      this.$store.commit('changeCollapse')
    },
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
  height: 100%;
  position: relative;
  .pull-button {
    cursor: pointer;
    border-radius: 5px 0 0 5px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    background-color: @sys-main-header;
    width: 10px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translate(0, -50%);
    color: #fff;
    z-index: 999;
  }
  .pull-button.right {
    border-radius: 0 5px 5px 0;
    transform: translate(100%, -50%);
    right: 1px;
  }
}
</style>
