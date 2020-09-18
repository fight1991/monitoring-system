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

      <!-- 服务器 -->
      <div class="pull-box">
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
            <div class="app-download flex-vertical-center" @click="downloadApp">
              <i class="iconfont icon-andriod-logo"></i>
              <span>Client Downloads</span>
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
  mounted () {},
  methods: {
    // 手机app下载连接
    downloadApp () {
      let { href } = this.$router.resolve({
        path: '/app/download'
      })
      window.open(href, '_blank')
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
