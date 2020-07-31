<template>
  <section>
    <el-row>
      <div class="col">用户名</div>
      <div class="col">{{username}}</div>
    </el-row>
    <el-row>
      <div class="col">密码</div>
      <div class="col">{{'***********'}}</div>
      <div class="col edit" @click="pwVisible=true">修改</div>
    </el-row>
    <el-dialog
      title="修改密码"
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
