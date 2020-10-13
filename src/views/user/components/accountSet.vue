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
      <div class="nap"><el-input v-model="linkCode" :placeholder="$t('user.inAgCode')" size="mini"></el-input></div>
      <el-button type="primary" size="mini" @click="joinOrgans('user')">{{$t('common.confirm')}}</el-button>
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
        <div class="nap"><el-input v-model="linkCode" :placeholder="$t('user.agCode')" size="mini"></el-input></div>
        <el-button type="primary" size="mini" @click="joinOrgans('installer')">{{$t('common.confirm')}}</el-button>
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
        <div class="nap get-code" @click="getInviteCode('agent')">{{$t('user.code')}}</div>
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
      agentCode: '',
      linkCode: '' // 安装商关联代理商的代码
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
          organType: this.access === 2 ? 'installer' : 'agent'
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
    async joinOrgans (organ) {
      let { result } = await this.$post({
        url: '/v0/organs/join',
        data: {
          code: this.linkCode,
          organType: organ,
          moduleSN: ''
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.linkCode = ''
      }
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
