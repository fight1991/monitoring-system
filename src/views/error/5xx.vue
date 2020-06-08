<template>
  <error :status="status" :content="content"></error>
</template>

<script>
import error from './error'
export default {
  components: {
    error
  },
  data () {
    return {
      status: '5xx',
      content: 'HTTP-500 Error !'
    }
  }
}
</script>

<style>

</style>
