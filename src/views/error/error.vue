<template>
  <div class="error">
    <h2>
      Error
      <small>{{status}}</small>
    </h2>
    <div>
      <span>{{content}}</span>
      <el-link type="primary" @click="gotoHome()">{{$t('common.backHome')}}</el-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    status: {
      default: ''
    },
    content: {
      default: ''
    }
  },
  methods: {
    gotoHome () {
      this.$router.push('/bus/index')
    }
  }
}
</script>

<style scoped>
.error {
  text-align: center;
}

.error h2 {
  color: #666;
}
</style>
