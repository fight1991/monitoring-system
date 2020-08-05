<template>
  <section>
    <el-row>
      <div class="col">{{$t('login.username')}}</div>
      <div class="col">{{username}}</div>
    </el-row>
    <el-row>
      <div class="col">{{$t('login.pw')}}</div>
      <div class="col">{{'***********'}}</div>
      <div class="col edit" @click="pwVisible=true">{{$t('user.edit')}}</div>
    </el-row>
    <el-dialog
      :title="$t('user.edit')+$t('login.pw')"
      :modal-append-to-body="false"
      :visible.sync="pwVisible">
      <div class="flex-center">
        <reset-pw :btnShow="1" @close:visible="pwVisible=false"></reset-pw>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import resetPw from '@/views/login/resetPw'
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
//@import url(); 引入公共css类
.el-row {
  padding: 15px 20px;
  .col {
    color: gray;
    float: left;
    width: 150px;
    margin-right: 10px;
  }
  .edit {
    color: @sys-main-header;
    cursor: pointer;
  }
}
</style>
