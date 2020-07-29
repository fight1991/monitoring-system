<template>
  <el-dropdown
    trigger="click"
    placement="top-start">
    <span class="app-downLoad flex-center">
      <i class="iconfont icon-app"></i>
      <!-- <span>APP</span> -->
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">

      <!-- 国内服务器 -->
      <div class="pull-box" v-if="version=='inside'">
        <!-- 如果是pc端显示apk下载二维码 -->
        <div class="login-down-type" v-if="sysFlag=='pc'">
          <el-dropdown-item>
            <div class="app-img">
              <qrcode-vue foreground="#015CA7" :value="qrcode" :size="size" level="H"></qrcode-vue>
            </div>
          </el-dropdown-item>
        </div>
        <!-- 手机端显示现在链接 -->
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
      </div>

      <!-- 国外服务器 -->
      <div class="pull-box" v-else>
        <!-- 如果是pc端显示二维码 -->
        <div class="login-down-type" v-if="sysFlag=='pc'">
          <el-dropdown-item>
            <div class="app-img flex-vertical-center">
              <div class="erweima">
                <qrcode-vue foreground="#015CA7" :value="hms" :size="size" level="H"></qrcode-vue>
                <div class="store-text">HUAWEI AppGallery</div>
              </div>
              <div class="erweima">
                <qrcode-vue foreground="#5BAF6C" :value="gms" :size="size" level="H"></qrcode-vue>
                <div class="store-text">Google Play</div>
              </div>
              <div class="erweima">
                <qrcode-vue foreground="#F89432" :value="apple" :size="size" level="H"></qrcode-vue>
                <div class="store-text">Apple App Store</div>
              </div>
            </div>
          </el-dropdown-item>
        </div>
        <!-- 手机端显示链接 -->
        <div class="down-type" v-else>
          <el-dropdown-item v-if="sysFlag=='android'">
            <div class="app-download flex-vertical-center" @click="windowopen('gms')">
              <i class="iconfont icon-andriod-logo"></i>
              <span>GMS</span>
              <i class="iconfont icon-download-circle"></i>
            </div>
          </el-dropdown-item>
          <el-dropdown-item v-if="sysFlag=='android'">
            <div class="app-download flex-vertical-center" @click="windowopen('hms')">
              <i class="iconfont icon-andriod-logo"></i>
              <span>HMS</span>
              <i class="iconfont icon-download-circle"></i>
            </div>
          </el-dropdown-item>
          <el-dropdown-item v-if="sysFlag=='ios'">
            <div class="app-download flex-vertical-center" @click="windowopen('apple')">
              <i class="iconfont icon-apple-logo"></i>
              <span>App Store</span>
              <i class="iconfont icon-download-circle"></i>
            </div>
          </el-dropdown-item>
        </div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { judgeClient } from '@/util'
export default {
  components: { QrcodeVue },
  data () {
    return {
      sysFlag: judgeClient(), // android ios pc
      qrcode: location.origin + '/app/download',
      size: 115,
      hms: process.env.VUE_APP_HMS,
      gms: process.env.VUE_APP_GMS,
      apple: process.env.VUE_APP_APPLE
    }
  },
  created () {},
  computed: {
    version () {
      return this.$store.state.version
    }
  },
  mounted () {},
  methods: {
    windowopen (type) {
      window.open(this[type], '_blank')
    },
    // 国内手机app二维码下载
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
//@import url(); 引入公共css类
// .iconfont {
//   font-size: 32px;
// }
.app-downLoad {
  color: @sys-main-header;
  padding: 2px 0;
  cursor: pointer;
  .iconfont {
    font-size: 32px;
  }
}
.erweima {
  margin: 5px 5px 0 5px;
  padding: 0 2px;
  box-shadow: 0 0 10px #ccc;
  .store-text {
    text-align: center;
    font-size: 12px;
    color: black;
  }
}

</style>
