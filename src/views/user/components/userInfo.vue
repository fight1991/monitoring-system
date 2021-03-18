<template>
  <section>
    <el-row>
      <div class="col border-b">
        <span class="label">{{$t('login.username') + ' : '}}</span>
        <span class="value">{{username}}</span>
      </div>
    </el-row>
    <el-row type="flex">
      <div class="col border-b">
        <span class="label">{{$t('login.pw') + ' : '}}</span>
        <span class="value">{{'***********'}}</span>
      </div>
      <div class="edit" @click="pwVisible=true">{{$t('user.edit')}}</div>
    </el-row>
    <el-dialog
      :title="$t('user.edit')+$t('login.pw')"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="pwVisible">
      <div class="flex-center">
        <reset-pw :btnShow="1" @close:visible="pwVisible=false"></reset-pw>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import resetPw from '@/views/login/components/resetPw'
export default {
  name: 'user-info',
  components: { resetPw },
  data () {
    return {
      pwVisible: false
    }
  },
  created () {},
  computed: {
    ...mapState({
      username: state => state.userInfo.user || ''
    })
  },
  methods: {

  }
}
</script>
<style lang='less' scoped>
@import url("../style/common.less");
</style>
