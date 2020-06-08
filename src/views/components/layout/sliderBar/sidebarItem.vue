<template>
  <div>
    <!-- 只有一级菜单 -->
    <template v-if="firstMenuShow">
      <el-menu-item :index="menuItem.path" v-show="menuPemission()">
        <i v-if="menuItem.icon" :class="'iconfont '+ menuItem.icon"></i>
        <span slot="title">{{$t('navBar.'+menuItem.meta.title) || ''}}</span>
      </el-menu-item>
    </template>
    <!-- 有二级菜单 -->
    <template v-else>
      <el-submenu v-show="menuPemission(menuItem)" :index="menuItem.path" popper-class="sidebar-pop">
        <template slot="title">
          <i v-if="menuItem.icon" :class="'iconfont '+ menuItem.icon"></i>
          <span slot="title">{{$t('navBar.'+menuItem.meta.title) || ''}}</span>
        </template>

        <template v-for="child in menuItem.children">
          <!-- 递归 -->
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :menuItem="child"
            :key="child.path"/>
          <!-- 二级菜单 -->
          <template v-else>
            <el-menu-item v-show="menuPemission(child, 'chidl')" :key="child.path" :index="child.path">
              <i v-if="child.icon" :class="'iconfont '+ child.icon"></i>
              <span slot="title">{{$t('navBar.'+child.meta.title) || ''}}</span>
            </el-menu-item>
          </template>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'sidebarItem',
  data () {
    return {}
  },
  computed: {
    firstMenuShow () {
      return !this.menuItem.children || this.menuItem.children.length === 0
    }
  },
  props: {
    menuItem: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  methods: {
    menuPemission (obj = this.menuItem, hh) {
      let { meta } = obj
      return !meta.permission || (meta.permission && meta.permission.includes(this.access))
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 10px;
  font-size: 18px;
}
</style>
