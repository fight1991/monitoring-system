<template>
  <div class="login-container">
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
            <el-dropdown-item command="zh_CN">中文</el-dropdown-item>
            <el-dropdown-item command="en" divided>English</el-dropdown-item>
            <el-dropdown-item command="pl" divided>Polskie</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <erweima></erweima>
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
          <span>{{$store.state.rightsTxt + $t('login.allRight')}}</span>
          <i class="shuxian"></i>
          <el-link type="info" :href="host" target="_blank">{{$t('login.site')}}</el-link>
          <i class="shuxian"></i>
          <el-link type="info" :href="agreeSrc" target="_blank">{{$t('login.useTerm')}}</el-link>
          <i class="shuxian" v-if="version=='inside'"></i>
          <a class="beian-num" v-if="version=='inside'" href="http://www.beian.miit.gov.cn/" target="_blank">苏ICP备20036769号-2</a>
        </p>
        <p class="flex-center">
          <span class="beian" v-if="version=='inside'"></span>
          <span class="beian-num" v-if="version=='inside'">苏公网安备 32021402001297号</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import login from './components/login'
import resetPw from './components/resetPw'
import { judgeClient, getLang } from '@/util'
import erweima from './components/erweima'
import storage from '@/util/storage'
export default {
  name: 'sign-in',
  components: {
    login,
    resetPw,
    erweima
  },
  data () {
    return {
      pageFlag: 'login', // 注册和密码公用页面
      currentLang: '中文',
      agreeSrc: '',
      sysFlag: judgeClient(), // android ios pc
      // andrImg: require('@/assets/android-app.png'),
      // iosImg: require('@/assets/ios-app.png'),
      qrcode: this.$store.state.domainName + '/app/download',
      size: 110,
      host: 'https://www.fox-ess.com', // 国外官网
      apiUrl: process.env.VUE_APP_WWW // 资源地址
    }
  },
  computed: {
    version () { // 判断是国内版本还是国外版本
      return this.$store.state.version
    },
    lang () {
      return this.$store.state.lang
    }
  },
  created () {
    if (this.version === 'inside') {
      this.host = 'http://www.fox-ess.com.cn' // 国内官网
    }
    let langInfo = storage.getStorage('lang')
    if (langInfo) {
      this.currentLang = getLang()['display'][langInfo]
    }
    this.agreeSrc = process.env.VUE_APP_WWW + `/i18n/${this.lang}/UserAgreement.html`
  },
  methods: {
    // 切换登录还是注册
    toggleStatus (typeStatus) {
      this.pageFlag = typeStatus
    },
    toggleLang (lang) {
      this.$i18n.locale = getLang()['transform'][lang]
      this.currentLang = getLang()['display'][lang]
      this.$store.commit('toggleLang', lang)
      storage.setStorage('lang', lang)
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
          color: @sys-main-header;
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
