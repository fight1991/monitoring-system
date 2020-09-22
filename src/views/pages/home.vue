<template>
  <div class="index">
    <div class="img-box">
      <div class="welcome-text">WELCOME</div>
      <img :src="bgIndex" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bgIndex: require('@/assets/index-bg.png')
    }
  }
}
</script>
<style lang="less" scoped>
.index {
  .img-box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 35%;
    transform: translate(-50%,-50%);
    img {
      width: 100%;
    }
    .welcome-text {
      font-size: 20px;
      position: absolute;
      left: 50%;
      top: 10px;
      transform: translate(-50%,0);
      color: #fff;
      letter-spacing: 3px;
      text-align: center;
      text-shadow: 1px 1px greenyellow, -1px -1px greenyellow,1px -1px greenyellow, -1px 1px greenyellow;
    }
  }
}
</style>
