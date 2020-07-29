<template>
  <div>
    <div :class="{'fix': modalShow, 'none': !modalShow}">
      <div class="img-box clearfix">
        <div class="img-arrow fr">
          <img :src="arrow" alt="">
        </div>
      </div>
      <div class="choose-item flex-vertical-center"><span class="number">1</span> 点击右上角的<i class="iconfont hide-icon icon-brower-menu"></i>按钮</div>
      <div class="choose-item flex-vertical-center"><span class="number">2</span> 选择<i class="iconfont hide-icon icon-brower"></i>在浏览器中打开</div>
    </div>
    <div class="title">客户端下载</div>
    <div class="download-btn flex-center">
      <div class="box">
        <div class="android flex-vertical-center">
          <i class="iconfont icon-andriod-logo app-logo"></i>
          <div class="text flex-vertical-center" @click="download('andriod')">
            <span>安卓</span>
            <i class="iconfont icon-download-circle load-logo"></i>
          </div>
        </div>
        <div class="apple flex-vertical-center">
          <i class="iconfont icon-apple-logo app-logo"></i>
          <div class="text flex-vertical-center" @click="download('apple')">
            <span>苹果</span>
            <i class="iconfont icon-download-circle load-logo"></i>
          </div>
        </div>
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
      client: judgeClient(),
      isWx: isWeiXin(),
      arrow: require('@/assets/app-arrow.png'),
      appAndr: process.env.VUE_APP_ANDROID,
      appApple: process.env.VUE_APP_APPLE
    }
  },
  created () {
    // 如果是ios则直接打开商城地址(微信或其他浏览器都可以打开)
    if (this.client === 'ios') {
      window.open(this.appApple, '_self')
    } else {
      // 为其他手机浏览器打开(不是微信中扫码的)
      if (!this.isWx && this.client !== 'pc') {
        window.open(this.appAndr, '_self')
      }
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
      if (this.modalShow) return
      let url = type === 'apple' ? this.appApple : this.appAndr
      window.open(url, '_blank')
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
  background-color: #52B32B;
  color: #fff;
}
.download-btn {
  width: 100%;
  margin-top: 30vh;
  .text {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    background-color: #52B32B;
    height: 36px;
    border-radius: 18px;
    padding: 5px 10px 5px 20px;
    box-sizing: border-box;
  }
}
.app-logo {
  color: #52B32B;
  font-size: 36px;
}
.load-logo {
  font-size: 24px;
  font-weight: bold;
  margin-left: 12px;
}
.app-logo {
  margin-right: 20px;
}
.android,.apple {
  margin: 20px auto;
}

</style>
