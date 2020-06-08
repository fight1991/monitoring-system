<template>
  <div class="index">
    <img :src="bgIndex" alt="">
  </div>
</template>
<script>
export default {
  data () {
    return {
      bgIndex: require('@/assets/welcome.png')
    }
  }
}
</script>
<style lang="less" scoped>
.index {
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%)
  }
}
</style>
