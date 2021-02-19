<template>
  <div class="head-container">
    <!-- 左侧页面导航 -->
    <div class="left-box flex-vertical-center">
      <div class="pull-icon" @click="toggleMenu"><i :class="{'el-icon-s-unfold':$store.state.collapse,'el-icon-s-fold':!$store.state.collapse}"></i></div>
      <div class="bread-navigator">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{$t('navBar.home')}}</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in routerArray" :key="item">{{$t('navBar.' + item)}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 刷新按钮 -->
      <div v-show="$route.name!='tab-index'" class="refresh-button" @click="refreshCurrentPage" :title="$t('common.refresh')">
        <i class="el-icon-refresh-right"></i>
      </div>
    </div>
    <!-- 右侧其他元素 -->
    <div class="right-box flex-vertical-center">
      <!-- <div class="system-set" @click="setDrawerShow=true">
        <i class="el-icon-setting"></i>
      </div> -->
      <!-- 用户名 -->
      <div class="tag-box">
        <el-tag size="small">{{$store.getters.username}}</el-tag>
      </div>
      <!-- 用户角色 -->
      <div class="tag-box">
        <el-tag type="success" size="small">{{roleName}}</el-tag>
      </div>
      <!-- 用户画像 -->
      <el-dropdown
        @command="userOption"
        trigger="click"
        placement="top-start">
        <span class="user-name flex-center">
          <div class="user-logo"><img :src="userLogo" alt=""></div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">{{$t('user.center')}}</el-dropdown-item>
          <el-dropdown-item command="logout" divided>{{$t('login.goOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 系统设置 -->
    <el-drawer
      title="系统设置"
      append-to-body
      :visible.sync="setDrawerShow"
      :with-header="false">
      <div class="system-setBox">
        <div class="title">系统布局配置</div>
        <div class="content">
          <el-row>
            <el-col :span="12">主题色</el-col>
            <el-col :span="12">
              <el-color-picker size="mini" v-model="primaryColor"></el-color-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              开启Tabs-View
            </el-col>
            <el-col :span="12">
              <el-switch v-model="tabModule"></el-switch>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layout-header',
  data () {
    return {
      tabModule: false,
      primaryColor: '#409EFF',
      setDrawerShow: false,
      isFullScreen: false,
      userLogo: require('@/assets/user-logo.png')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    routerArray () {
      if (this.$route.name === 'tab-index') {
        return []
      }
      let temp = this.$route.matched.map(v => v.meta.title)
      return temp.length > 1 ? temp.slice(1) : temp
    }
  },
  created () {
    window.addEventListener('resize', () => {
      !document.fullscreen && (this.isFullScreen = false)
    })
  },
  methods: {
    refreshCurrentPage () {
      this.$store.dispatch('refreshTab', this.$store.getters.currentTabInfo)
    },
    // 切换全屏
    screenClick (type) {
      this.isFullScreen = type === 'enter'
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen() // 文档流全屏
        // document.documentElement.requestFullscreen.call('dom') // 是dom元素全屏
      }
    },
    toggleMenu () {
      this.$store.commit('changeCollapse')
    },
    userOption (op) {
      if (op === 'logout') {
        this.logout()
      }
      if (op === 'user') {
        this.goUser()
      }
    },
    // 跳转到个人中心页面
    goUser () {
      this.$router.push({
        name: 'user-center'
      })
    },
    // 修改密码
    goResetPw () {
      let { href } = this.$router.resolve({
        path: '/login',
        query: {
          type: 'reset',
          redirect: this.$router.currentRoute.fullPath
        }
      })
      sessionStorage.setItem('username', this.userInfo.user)
      window.open(href, '_self')
    },
    // 注销登录
    async logout () {
      let res = await this.$openConfirm({
        content: this.$t('login.tips3')
      })
      if (!res) return
      let { result } = await this.$post({
        url: '/c/v0/user/logout'
      })
      if (result) {
        let { href } = this.$router.resolve({
          path: '/login'
        })
        window.open(href, '_self')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.head-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.system-setBox {
  padding: 30px 10px;
}
.left-box {
  height: 100%;
  .el-icon-s-unfold, .el-icon-s-fold{
    font-size: 22px;
    font-weight: 200;
    cursor: pointer;
  }
  .pull-icon {
    margin-right: 15px;
  }
  .el-breadcrumb {
    font-size: 12px;
  }
  .refresh-button {
    cursor: pointer;
    margin: 0 30px;
    border-radius: 50%;
    color: #606266;
    padding: 2px;
    i {
      transition: all 1.5s;
      font-size: 20px;
    }
    &:hover {
      background-color: #d8d8d8;
      i {
        transform: rotate(270deg);
      }
    }
  }
}
.right-box {
  height: 100%;
  display: flex;
  align-items: center;
  .tag-box {
    margin-right: 15px;
  }
  // color: #fff;
  .el-dropdown {
    color: #fff;
  }
  .el-popper[x-placement^=bottom] .popper__arrow {
    display: none;
  }
  .lang, .user-name {
    cursor: pointer;
    margin-right: 15px;
  }
  .user-logo {
    margin-right: 5px;
    width: 32px;
    box-shadow: 0 0 5px 2px #ccc;
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
  .info {
    padding: 0 20px;
  }
}
.fullscreen {
  cursor: pointer;
  padding: 0 20px;
  transition: all .2s;
  &:hover {
    transform: scale(1.5);
  }
}
</style>
