<template>
  <section>
    <el-row>
      <div class="col border-b">
        <span class="label">{{$t('user.type') + ' : '}}</span>
        <span class="value">{{translateTools(access)}}</span>
      </div>
    </el-row>
    <el-row type="flex" align="middle" v-if="access==1">
      <div class="nap">{{$t('user.assoInAg')}}</div>
      <div class="nap"><el-input :placeholder="$t('user.inAgCode')" size="mini"></el-input></div>
      <el-button type="primary" size="mini">{{$t('common.confirm')}}</el-button>
    </el-row>
    <div v-if="access==2">
      <el-row>
        <div class="col border-b">
          <span class="label">{{$t('user.inCode') + ' : '}}</span>
          <span class="value">{{initCode}}</span>
        </div>
      </el-row>
      <el-row type="flex" align="middle">
        <div class="nap">{{$t('user.assoAg')}}</div>
        <div class="nap"><el-input :placeholder="$t('user.agCode')" size="mini"></el-input></div>
        <el-button type="primary" size="mini">{{$t('common.confirm')}}</el-button>
      </el-row>
    </div>
    <div v-if="access==3">
      <el-row>
        <div class="col border-b">
          <span class="label">{{$t('user.agCode') + ' : '}}</span>
          <span class="value">{{initCode}}</span>
        </div>
      </el-row>
      <el-row type="flex" align="middle">
        <div class="nap get-code" @click="getAgentCode">{{$t('user.code')}}</div>
        <div class="nap"><el-input v-model="agentCode" readonly :placeholder="$t('user.invCode')" size="mini"></el-input></div>
      </el-row>
    </div>
  </section>
</template>

<script>
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
      let { result } = await this.$get({
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
