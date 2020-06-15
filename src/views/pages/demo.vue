<template>
  <div class="demo" v-setH="setDivH">
    <!-- <h1>This page is not found , Coming soon</h1> -->
    <div class="img-block"><img :src="soonUrl" alt=""></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      soonUrl: require('@/assets/soon.png')
    }
  }
}
</script>

<style lang="less" scoped>
.demo {
  // height: 1000px;
  background-color:#fff;
  border-top:1px solid transparent;
  text-align: center;
}
#map_canvas {
  margin: 0 auto;
}
.img-block {
  margin: 0 auto;
  width: 280px;
  margin-top: 20vh;
  img {
    width: 100%;
  }
}
</style>
