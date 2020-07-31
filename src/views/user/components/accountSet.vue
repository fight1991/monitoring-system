<template>
  <section>
    <el-row>
      <div class="col">用户类型</div>
      <div class="col">{{translateTools(access)}}</div>
    </el-row>
    <el-row class="flex-vertical-center">
      <div class="col">
        <el-dropdown
          @command="getOpText"
          trigger="click">
          <span class="el-dropdown-link">
            获取邀请码<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="成为安装商" @click.native="getInviteCode('installer')">安装商</el-dropdown-item>
            <el-dropdown-item command="加入代理商" @click.native="getInviteCode('agent')" divided>代理商</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="col getCode">
        <span></span>
        <el-input size="mini" v-model="invitCode" readOnly>
          <span slot="suffix">{{opText}}</span>
        </el-input>
      </div>
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'user-info',
  data () {
    return {
      invitCode: '',
      opText: this.$t('common.select')
    }
  },
  created () {},
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
    async getInviteCode (type) {
      let { result } = await this.$axios({
        url: '/v0/organs/invitation',
        data: {
          organType: type
        }
      })
      if (result) {
        this.invitCode = result.code || ''
      }
    },
    getOpText (command) {
      this.opText = command
    }
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
  .getCode {
    width: 200px;
  }
  .edit {
    color: @sys-main-header;
    cursor: pointer;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: @sys-main-header;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.border-line {
  border-bottom: 1px solid #ccc;
}
.el-input__suffix-inner {
  span {
    line-height: 28px;
  }
}
</style>
