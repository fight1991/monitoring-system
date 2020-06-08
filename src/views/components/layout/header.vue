<template>
  <div class="head-container">
    <div class="logo fl">
      <img :src="logoSrc">
      <span>{{$t('monitor')}}</span>
    </div>
    <div class="login fr">
      <el-dropdown
        trigger="click"
        @command="toggleLang"
        placement="top-start">
        <span class="lang">
          <span>{{lang}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en" divided>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        @command="userOption"
        trigger="click"
        placement="top-start">
        <span class="user-name">
          <i class="user-logo iconfont icon-user"></i>
          <span>{{userInfo.user || ''}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="reset">{{$t('login.resetPw')}}</el-dropdown-item>
          <el-dropdown-item command="logout" divided>{{$t('login.goOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <span class="info"><i class="iconfont icon-info"></i></span> -->
      <span class="fullscreen" v-show="!isFullScreen" @click="screenClick('enter')" :title="$t('common.enterFull')"><i class="iconfont icon-enter-fullScreen"></i></span>
      <span class="fullscreen" v-show="isFullScreen" @click="screenClick('out')" :title="$t('common.outFull')"><i class="iconfont icon-out-fullScreen"></i></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layout-header',
  data () {
    return {
      isFullScreen: false,
      lang: '中文',
      logoSrc: require('@/assets/logo.png')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  created () {
    window.addEventListener('resize', () => {
      !document.fullscreen && (this.isFullScreen = false)
    })
  },
  methods: {
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
    // 切换语言
    toggleLang (lang) {
      this.$i18n.locale = lang
      this.lang = lang === 'en' ? 'English' : '中文'
      this.$store.commit('toggleLang', lang)
      document.title = this.$t('navBar.' + this.$route.meta.title)
    },
    userOption (op) {
      if (op === 'logout') {
        this.logout()
      } else {
        this.goResetPw()
      }
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
      let res = await this.$confirm(this.$t('login.tips3'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => true).catch(() => false)
      if (!res) return
      this.$post({
        url: '/v0/user/logout',
        success: () => {
          let { href } = this.$router.resolve({
            path: '/login'
          })
          window.open(href, '_self')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.head-container {
  width: 100%;
  height: 100%;
}
.login, .logo {
  height: 100%;
  display: flex;
  align-items: center;
}
.login {
  color: #fff;
  .el-dropdown {
    color: #fff;
  }
  .el-popper[x-placement^=bottom] .popper__arrow {
    display: none;
  }
  .lang, .user-name {
    cursor: pointer;
    margin-right: 10px;
  }
  .user-logo {
    padding-right: 5px;
  }
  .info {
    padding: 0 20px;
  }
}
.logo {
  height: 100%;
  img {
    width: 40px;
  }
  span {
    color: #fff;
    margin-left: 20px;
    font-size: 16px;
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
