<template>
  <div id="app">
    <keep-alive :exclude="['router-login']">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>

export default {
  data () {
    return {}
  }
}
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  color: #4c4c4c;
}
</style>
