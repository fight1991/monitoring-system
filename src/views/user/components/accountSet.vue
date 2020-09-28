<template>
  <section>
    <el-row>
      <div class="col border-b">
        <span class="label">{{$t('user.type') + ' : '}}</span>
        <span class="value">{{translateTools(access)}}</span>
      </div>
    </el-row>
    <el-row type="flex" align="middle" v-if="access==1">
      <div class="nap">{{'关联代理商/安装商'}}</div>
      <div class="nap"><el-input placeholder="代理商/安装商代码" size="mini"></el-input></div>
      <el-button type="primary" size="mini">{{$t('common.confirm')}}</el-button>
    </el-row>
    <div v-if="access==2">
      <el-row>
        <div class="col border-b">
          <span class="label">{{'安装商代码'}}</span>
          <span class="value">{{initCode}}</span>
        </div>
      </el-row>
      <el-row type="flex" align="middle">
        <div class="nap">{{'关联代理商'}}</div>
        <div class="nap"><el-input placeholder="代理商代码" size="mini"></el-input></div>
        <el-button type="primary" size="mini">{{$t('common.confirm')}}</el-button>
      </el-row>
    </div>
    <div v-if="access==3">
      <el-row>
        <div class="col border-b">
          <span class="label">{{'代理商代码'}}</span>
          <span class="value">{{initCode}}</span>
        </div>
      </el-row>
      <el-row type="flex" align="middle">
        <div class="nap get-code" @click="getAgentCode">{{'生成邀请码'}}</div>
        <div class="nap"><el-input v-model="agentCode" readonly placeholder="邀请码" size="mini"></el-input></div>
      </el-row>
    </div>
  </section>
</template>

<script>
// import joinDialog from '@/views/product/joinDialog'
export default {
  name: 'user-info',
  // components: { joinDialog },
  data () {
    return {
      invitCode: '',
      opText: '',
      joinVisible: false,
      initCode: '',
      agentCode: ''
    }
  },
  created () {
    if (this.access > 1) {
      this.getInviteCode()
    }
  },
  methods: {
    translateTools (type) {
      switch (type) {
        case 1:
          return this.$t('join.endUser')
        case 2:
          return this.$t('join.installer')
        case 3:
          return this.$t('join.agent')
        default:
          return 'admin'
      }
    },
    async getInviteCode (flag) {
      let { result } = await this.$axios({
        url: '/v0/organs/invitation',
        data: {
          organType: ''
        }
      })
      if (result) {
        if (flag) {
          this.agentCode = result.code || ''
        } else {
          this.initCode = result.code || ''
        }
      }
    },
    getAgentCode () {
      this.getInviteCode('agent')
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
@import url("../style/common.less");
.get-code {
  cursor: pointer;
  &:hover {
    color: @sys-main-header;
  }
}
.nap {
  margin-right: 15px;
}
</style>
