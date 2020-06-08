<template>
  <div class="container">
    <el-container class="outside-container">
      <el-header class="main-header" height="50px">
        <layout-header></layout-header>
      </el-header>
      <el-container class="main-container">
        <el-aside class="main-aside" :width="$store.state.collapse ? '64px': '200px'">
          <layout-aside></layout-aside>
        </el-aside>
        <el-main class="main-tab">
          <tab-view></tab-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- <el-button @click="btnClick">点我发送</el-button> -->
  </div>
</template>

<script>
import layoutHeader from '@/views/components/layout/header'
import layoutAside from '@/views/components/layout/sliderBar/aside'
import tabView from '@/views/components/layout/tabView'
export default {
  name: 'router-main',
  components: {
    layoutHeader,
    layoutAside,
    tabView
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    btnClick () {

    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.outside-container {
  height: 100%;
}
.main-header {
  background-color: @sys-main-header;
}
.main-container {
  height: calc(100% - 50px);
}
.main-tab {
  padding: 0;
}
.main-aside {
  border-right: 1px solid #ccc;
  height: 100%;
}
</style>
