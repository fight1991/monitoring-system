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
      status: '403',
      content: 'HTTP-403 Forbidden !'
    }
  }
}
</script>

<style>

</style>
