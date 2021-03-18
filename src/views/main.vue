<template>
  <div class="container">
    <el-container class="outside-container">
      <el-aside :class="{'main-aside':true, 'open-duration': isDuration }" :width="$store.state.collapse ? '64px': distance + 'px'">
        <div class="aside-box">
          <div class="logo">
            <img :src="logoSrc">
            <span v-show="!$store.state.collapse">{{$t('monitor')}}</span>
          </div>
          <layout-aside @getMoveDistance="getMoveDistance"></layout-aside>
        </div>
      </el-aside>
      <el-container class="main-container">
        <el-header class="main-header" height="40px">
          <layout-header></layout-header>
        </el-header>
        <el-main class="main-tab">
          <tab-view></tab-view>
        </el-main>
      </el-container>
    </el-container>
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
      logoSrc: require('@/assets/logo.png'),
      distance: 210
    }
  },
  created () {

  },
  computed: {
    isDuration () {
      return this.distance > 215
    }
  },
  methods: {
    btnClick () {

    },
    getMoveDistance (x) {
      this.distance = x
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.logo {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 10px;
  background-color: rgba(255,255,255,.1);
  box-sizing: border-box;
  img {
    width: 40px;
  }
  span {
    color: #f5f5f5;
    margin-left: 15px;
    font-size: 16px;
  }
}
.outside-container {
  height: 100%;
}
.main-header {
<<<<<<< HEAD
  background-color: #212A39;
  border-bottom: 1px solid #444850;
=======
  // background-color: @sys-main-header;
  background-color: #fff;
  position: relative;
  z-index: 3;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .09);
  padding: 0 10px;
}
.aside-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: @sys-aside-bg;
>>>>>>> dev
}
.main-container {
  overflow: hidden;
}
.main-tab {
  padding: 0;
}
.main-aside {
  border-right: 1px solid #ccc;
}
</style>
