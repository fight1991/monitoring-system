<template>
<div class="app-link-container bg-c">
  <div :class="{'fix': modalShow, 'none': !modalShow}">
    <div class="img-box clearfix">
      <div class="img-arrow fr">
        <img :src="arrow" alt="">
      </div>
    </div>
    <div class="choose-item flex-vertical-center"><span class="number">1</span> Click the button in the upper right corner</div>
    <div class="choose-item flex-vertical-center"><span class="number">2</span> Select<i class="iconfont hide-icon icon-brower"></i>in the browser</div>
  </div>
  <div class="title">Client Downloads</div>
  <div class="download-btn">
    <div class="android flex-column-center" @click="download('google')">
      <div class="googleImg img-box"><img :src="googleImg" alt=""></div>
      <div class="txt">Google Play</div>
    </div>
    <div class="android flex-column-center" @click="download('huawei')">
      <div class="huaweiImg img-box"><img :src="huaweiImg" alt=""></div>
      <div class="txt">HUAWEI AppGallery</div>
    </div>
    <div class="apple flex-column-center" @click="download('apple')">
      <div class="img-box"><img :src="appImg" alt=""></div>
      <div class="txt">App Store</div>
    </div>
  </div>
</div>

</template>

<script>
/**
 * 如果是android端微信扫码, 直接显示点击按钮, 否则直接下载
 */
import { judgeClient, isWeiXin } from '@/util'
export default {
  components: {},
  data () {
    return {
      googleImg: require('@/assets/googlePlay.png'),
      appImg: require('@/assets/appStore.png'),
      huaweiImg: require('@/assets/huaweiPlay.png'),
      client: judgeClient(),
      isWx: isWeiXin(),
      arrow: require('@/assets/app-arrow.png'),
      huawei: process.env.VUE_APP_HMS,
      apple: process.env.VUE_APP_APPLE,
      google: process.env.VUE_APP_GMS,
      appvers: process.env.VUE_APP_VERSION
    }
  },
  created () {
    // 如果是ios则直接打开商城地址(微信或其他浏览器都可以打开)
    if (this.client === 'ios') {
      window.open(this.apple, '_self')
    }
  },
  mounted () {},
  computed: {
    modalShow () { // andriod中的微信浏览器,显示modal
      return this.client === 'android' && this.isWx
    }
  },
  methods: {
    download (type) {
      if (this.appvers !== 'abroad') return
      if (this.modalShow) return
      window.open(this[type], '_blank')
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.hide-icon {
  margin: 0 5px;
}
.none {
  display: none;
}
.fix {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.7);
  color: #fff;
  .choose-item {
    padding: 5px 30px;
    font-size: 16px;
    .icon-brower-menu {
      transform: rotate(90deg);
    }
  }
  .number {
    line-height: 20px;
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    margin-right: 5px;
    border-radius: 50%;
    background-color: #E6A23C;
  }
}
.img-arrow {
  width: 50%;
  img {
    width: 100%;
  }
}
.title {
  text-align: center;
  padding: 8px;
  background-color: @sys-main-header;
  color: #fff;
  font-weight: bold;
}
.download-btn {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 30vh;
  .txt {
    padding: 10px 0;
    font-weight: bold;
    text-align: center;
  }
  img {
    margin: 0 auto;
    width: 100%;
  }
  .googleImg {
    margin-left: 15px;
  }
}
.app-link-container {
  height: 100%;
  width: 100%;
}
.android,.apple {
  // width: 80px;
  width: 30%;
  padding: 0 10px;
  box-sizing: border-box;
  img {
    max-width: 90px;
  }
}

</style>
