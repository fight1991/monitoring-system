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
      status: '401',
      content: 'HTTP-401 Unauthorized !'
    }
  }
}
</script>

<style>

</style>
