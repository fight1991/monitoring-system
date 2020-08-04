<template>
  <div class="login-container">
    <div class="header">
      <div class="login-logo flex-center">
        <!-- <img src="@/assets/logo.png" alt=""> -->
        <!-- <span>FoxESS</span> -->
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
        <erweima></erweima>
      </div>
    </div>
    <div class="content">
      <div class="keda-logo"><img :src="kedaLogo" alt=""></div>
      <div class="invert"></div>
      <transition name="zoom">
        <keep-alive>
          <component :is="pageFlag" @toggleStatus="toggleStatus"></component>
        </keep-alive>
      </transition>
    </div>
    <div class="footer">
      <div class="footer-content">
        <!-- <p class="flex-center some-link">
          <span>{{$store.state.rightsTxt + $t('login.allRight')}}</span>
          <i class="shuxian"></i>
          <el-link type="info" :href="host" target="_blank">{{$t('login.site')}}</el-link>
          <i class="shuxian"></i>
          <el-link type="info" :href="apiUrl + '/i18n/zh_CN/UserAgreement.html'" target="_blank">{{$t('login.useTerm')}}</el-link>
          <i class="shuxian" v-if="version=='inside'"></i>
          <a class="beian-num" v-if="version=='inside'" href="http://www.beian.miit.gov.cn/" target="_blank">苏ICP备20036769号-2</a>
        </p> -->
        <p class="flex-center">
          <!-- <span class="beian" v-if="version=='inside'"></span>
          <span class="beian-num" v-if="version=='inside'">苏公网安备 32021402001297号</span>
          <a class="beian-num" v-if="version=='inside'" href="http://www.beian.miit.gov.cn/" target="_blank">苏ICP备20036769号-2</a> -->
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import login from './login'
import register from './register'
import resetPw from './resetPw'
import { judgeClient } from '@/util'
import erweima from './qrcode/erweima'
export default {
  name: 'router-login',
  components: {
    login,
    register,
    resetPw,
    erweima
  },
  data () {
    return {
      pageFlag: 'login', // 注册和密码公用页面
      lang: '中文',
      sysFlag: judgeClient(), // android ios pc
      // andrImg: require('@/assets/android-app.png'),
      // iosImg: require('@/assets/ios-app.png'),
      qrcode: location.origin + '/app/download',
      size: 110,
      kedaLogo: require('@/assets/keda-logo-transparent.png'),
      host: 'https://www.fox-ess.com', // 国外官网
      apiUrl: process.env.VUE_APP_WWW // 资源地址
    }
  },
  computed: {
    version () { // 判断是国内版本还是国外版本
      return this.$store.state.version
    }
  },
  created () {
    if (process.env.VUE_APP_VERSION === 'inside') {
      this.host = 'http://www.fox-ess.com.cn' // 国内官网
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
      this.$store.commit('toggleLang', lang)
    },
    // 手机app二维码下载
    downloadApp () {
      let url = process.env.VUE_APP_ANDROID
      if (this.sysFlag === 'ios') {
        url = process.env.VUE_APP_APPLE
      }
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.some-link {
  flex-wrap: wrap;
}
.app-img {
  padding: 5px 5px 0 5px;
  box-shadow: 0 0 10px #f1f1f1;
}

.beian {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url('../../assets/government.png') no-repeat;
}
.beian-num {
  margin: 0 5px;
  text-decoration: none;
  color: #939393;
}
.gap {
  margin: 0 5px;
}
.shuxian {
  display: block;
  height: 10px;
  width: 1px;
  border-right: 1px solid #999;
  margin: 0 5px;
}
  .login-container {
    background: url("../../assets/inverter-bg.png") no-repeat left center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    position: relative;
    .header,.footer {
      // background-color: #fff;
    }
    .footer-content {
      font-size: 12px;
      color: #939393;
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
          color: #fff;
        }
      }
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      font-size: 22px;
      .lang {
        cursor: pointer;
        margin-right: 15px;
        .iconfont {
          font-size: 32px;
        }
      }
    }
    .content {
      min-height: 400px;
      // background: linear-gradient(40deg, #1174b6 40%, #2398dd 80%,#56b3e9);
      // background: url("../../assets/inverter-bg.png") no-repeat left center;
      // background-size: cover;
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      .keda-logo {
        width: 400px;
        position: absolute;
        top: 0;
        right: 15%;
        img {
          width: 100%;
        }
      }
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
      // box-shadow: 0 0 10px #ddd;
      z-index: 6;
      position: absolute;
      right: 15%;
      // transform: translate(-50%,-50%); // 会改变变换的中心值
      // transform-origin: center;
      width: 450px;
      box-sizing: border-box;
      background-color: transparent;
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
      span {
        &:hover {
          color: @sys-main-header;
        }
        cursor: pointer;
      }
    }
  }
@media only screen and(max-width:1080px) {
  .login, .keda-logo{
    width: 380px!important;
    right: 5%;
  }
}
  // 兼容手机端
@media only screen and(max-width:768px) {
  .login, .keda-logo{
    width: calc(100% - 20px)!important;
    margin: 0 10px;
    right: 0!important;
  }
  .login-container .header {
    padding-left: 0;
  }
}
@media only screen and(min-width:1080px) {
  .login, .keda-logo{
    width: 480px!important;
    right: 5%!important;
  }
}
@media only screen and(min-width:1400px) {
  .login, .keda-logo{
    width: 480px!important;
    right: 10%!important;
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
