<template>
<div class="sidebar-container">
  <div
    class="sidebar-drag"
    @mousedown="mouseDown">
  </div>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.name"
      unique-opened
      @select="menuClick"
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
      menuList: this.deal(navMenu),
      startX: 0,
      movePosition: 0
    }
  },
  computed: {
    isCollapase () {
      return this.$store.state.collapse
    }
  },
  mounted () {
    window.addEventListener('resize', this.changeCollapseStatus)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.changeCollapseStatus)
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
    },
    // 点击侧边栏路由跳转
    menuClick (name) {
      this.$tab.append({
        name
      })
    },
    changeCollapseStatus () {
      if (window.innerWidth < 992) {
        !this.isCollapase && this.$store.commit('changeCollapse', 1)
      }
    },
    mouseDown (e) {
      let _this = this
      _this.startX = e.clientX
      document.onselectstart = function () { return false }
      document.onmousemove = function (e) {
        if (e.clientX >= 210) {
          _this.$emit('getMoveDistance', e.clientX)
        }
      }
      document.onmouseup = function (e) {
        this.onmousemove = null
        document.onselectstart = null
      }
      document.onmouseleave = function (e) {
        this.onmousemove = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar-container {
  // flex: 1;
  position: relative;
  height: calc(100% - 50px);
  .sidebar-drag {
    position: absolute;
    right: 0;
    top: 0;
    background-color: transparent;
    width: 8px;
    height: 100%;
    z-index: 10;
    cursor: e-resize;
  }
}
</style>
