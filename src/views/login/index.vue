<template>
  <div class="login-container" v-loading="$store.state.loading">
    <div class="header">
      <div class="login-logo flex-center">
        <img src="@/assets/logo.png" alt="">
        <span>FoxESS</span>
      </div>
      <div class="header-right flex-center">
        <el-dropdown
          trigger="click"
          @command="toggleLang"
          placement="top-start">
          <span class="lang flex-center">
            <i class="iconfont icon-yuyan"></i>
            <!-- <span>{{lang}}</span> -->
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en" divided>English</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          trigger="click"
          placement="top-start">
          <span class="app-downLoad flex-center">
            <i class="iconfont icon-app"></i>
            <!-- <span>APP</span> -->
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="login-down-type" v-if="sysFlag=='pc'">
              <el-dropdown-item>
                <div class="app-img flex-vertical-center">
                  <img :src="andrImg" alt="Android">
                  <img :src="iosImg" alt="IOS">
                </div>
              </el-dropdown-item>
            </div>
            <div class="down-type" v-else>
              <el-dropdown-item>
                <div class="app-download flex-vertical-center" @click="downloadApp('andr')">
                  <i class="iconfont icon-andriod-logo"></i>
                  <span>Android</span>
                  <i class="iconfont icon-download-circle"></i>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="sysFlag=='ios'">
                <div class="app-download flex-vertical-center" @click="downloadApp('apple')">
                  <i class="iconfont icon-apple-logo"></i>
                  <span>Apple</span>
                  <i class="iconfont icon-download-circle"></i>
                </div>
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <div class="invert"></div>
      <transition name="zoom">
        <keep-alive>
          <component :is="pageFlag" @toggleStatus="toggleStatus"></component>
        </keep-alive>
      </transition>
    </div>
    <div class="footer">
      <div class="footer-content">
        <p class="flex-center some-link">
          <el-link type="info" href="https://www.fox-ess.com/" target="_blank">{{$t('login.site')}}</el-link>
          <i class="gap">-</i>
          <el-link type="info" href="http://8.209.116.72/i18n/zh_CN/UserAgreement.html" target="_blank">{{$t('login.useTerm')}}</el-link>
          <i class="gap">-</i>
          {{$t('login.product')}}
          <span class="gap">:</span>
          <el-link type="info" href="https://fox-ess.com/single-phase/" target="_blank">{{$t('login.sSeries')}}</el-link>
          <i class="gap">-</i>
          <el-link type="info" href="https://fox-ess.com/single-phase/" target="_blank">{{$t('login.eSeries')}}</el-link>
          <i class="gap">-</i>
          <el-link type="info" href="https://fox-ess.com/single-phase/" target="_blank">{{$t('login.tSeries')}}</el-link>
          <i class="gap">-</i>
          <el-link type="info" href="https://fox-ess.com/single-phase/" target="_blank">{{$t('login.acStore')}}</el-link>
        </p>
        <p>{{$store.state.rightsTxt + $t('login.allRight')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import login from './login'
import register from './register'
import resetPw from './resetPw'
import { judgeClient } from '@/util'
export default {
  name: 'router-login',
  components: {
    login,
    register,
    resetPw
  },
  data () {
    return {
      pageFlag: 'login', // 注册和密码公用页面
      lang: '中文',
      sysFlag: judgeClient(), // android ios pc
      andrImg: require('@/assets/android-app.png'),
      iosImg: require('@/assets/ios-app.png')
    }
  },
  created () {
    // 系统header按钮跳转过来
    if (this.$route.query.type === 'reset') {
      this.toggleStatus('resetPw')
    }
  },
  methods: {
    // 切换登录还是注册
    toggleStatus (typeStatus) {
      this.pageFlag = typeStatus
    },
    toggleLang (lang) {
      this.$i18n.locale = lang
      this.lang = lang === 'en' ? 'English' : '中文'
    },
    // 手机app二维码下载
    downloadApp () {
      let url = 'http://foxesscloud.com/c/download/app/foxcloud_app.apk'
      if (this.sysFlag === 'ios') {
        url = 'https://apps.apple.com/us/app/id1512581978'
      }
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.app-download {
  padding: 2px 0;
  span {
    margin-right: 5px;
  }
}
.some-link {
  flex-wrap: wrap;
}
.app-img {
  img {
    display: block;
    width: 110px;
    margin: 0 10px;
    box-shadow: 0 0 10px #f1f1f1;
  }
}
.gap {
  margin: 0 5px;
}
  .login-container {
    // background: url("../../assets/inverter-bg.png") no-repeat left center;
    // background-size: cover;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    background-size: cover;
    position: relative;
    .header,.footer {
      background-color: #fff;
    }
    .footer-content {
      font-size: 12px;
      color: #999;
      text-align:center;
      // width: 1000px;
      // margin: 0 auto;
      padding: 10px 0;
    }
    .header {
      .login-logo {
        img {
          width: 50px;
        }
        span {
          margin-left: 5px;
        }
        width: 150px;
        color: @sys-main-header;
        font-weight: bold;
      }
      .header-right {
        span {
          color: @sys-main-header;
        }
      }
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      font-size: 22px;
      .app-downLoad, .lang {
        cursor: pointer;
      }
      .lang {
        margin-right: 15px;
      }
      .iconfont {
        font-size: 32px;
      }
    }
    .content {
      min-height: 400px;
      // background: linear-gradient(40deg, #1174b6 40%, #2398dd 80%,#56b3e9);
      background: url("../../assets/inverter-bg.png") no-repeat left center;
      background-size: cover;
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      .sys-text {
        z-index: 66;
        .top {
          letter-spacing: 2px;
          font-weight: bold;
          color: @sys-main-header;
        }
        .down {
          font-family: Rajdhani;
          letter-spacing: 1px;
          font-weight: 700;
          font-size: 60px;
        }
      }
      .bg {
        // height: 300px;
        z-index: 5;
        position: absolute;
        left: 10%;
        width: 500px;
        img {
          width: 100%;
        }
      }
    }
    .login {
      box-shadow: 0 0 10px #ddd;
      z-index: 6;
      position: absolute;
      right: 15%;
      // transform: translate(-50%,-50%); // 会改变变换的中心值
      // transform-origin: center;
      width: 450px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 2px;
      padding: 20px 25px 25px;
      color: #999;
    }
    .tab-header {
      display: flex;
      // border-bottom: 1px solid #d8d8d8;
      .tab-item {
        user-select: none;
        cursor: pointer;
        width: 50%;
        text-align: center;
        font-size: 16px;
        line-height: 38px;
        height: 38px;
        border-bottom: 2px solid #d8d8d8;
      }
      .active {
        border-bottom: 2px solid @sys-main-header;
      }
    }
    .find-btn {
      color: #3883c2;
      span {
        &:hover {
          color: @sys-main-header;
        }
        cursor: pointer;
      }
    }
  }
@media only screen and(max-width:1080px) {
  .login{
    width: 380px!important;
    right: 5%;
  }
  .content .bg {
    width: 360px!important;
    left: 5%!important;
  }
}
  // 兼容手机端
@media only screen and(max-width:768px) {
  .login{
    width: calc(100% - 20px)!important;
    margin: 0 10px;
    right: 0!important;
  }
  .login-container .header {
    padding-left: 0;
  }
  .content .bg {
    display: none;
  }
}
@media only screen and(min-width:1080px) {
  .login{
    width: 480px!important;
    right: 5%!important;
  }
  .content .bg {
    width: 440px!important;
    left: 5%!important;
  }
}
@media only screen and(min-width:1400px) {
  .login{
    width: 480px!important;
    right: 10%!important;
  }
  .content .bg {
    width: 460px!important;
    left: 10%!important;
  }
}
@keyframes drop {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(.3, .3, .3);
  }

  50% {
    opacity: 1;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    transform: scale3d(.3, .3, .3);
  }

  to {
    opacity: 0;
  }
}
.zoom-enter-active,.zoom-leave-active {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.zoom-enter-active {
  animation-name: zoomIn;
}
.zoom-leave-active {
  animation-name: zoomOut;
}
</style>
