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
      status: '404',
      content: 'HTTP-404 Not Found !'
    }
  }
}
</script>

<style>

</style>
