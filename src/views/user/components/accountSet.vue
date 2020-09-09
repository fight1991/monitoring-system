<template>
  <section>
    <el-row>
      <div class="col">{{$t('user.type')}}</div>
      <div class="col border-b">{{translateTools(access)}}</div>
    </el-row>
    <el-row class="flex-vertical-center" v-if="access>=3">
      <div class="col">
        <el-dropdown
          trigger="click">
          <span class="el-dropdown-link">
            {{$t('user.code')}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="getInviteCode('installer')">{{$t('join.installer')}}</el-dropdown-item>
            <el-dropdown-item @click.native="getInviteCode('agent')" divided>{{$t('join.agent')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="col getCode">
        {{opText}}
        <!-- <el-input size="mini" v-model="invitCode" readOnly>
          <span slot="suffix"></span>
        </el-input> -->
      </div>
    </el-row>
    <el-row v-if="access==2 || access==255">
      <el-button size="mini" type="primary" @click="joinVisible=true">{{$t('user.installer')}}</el-button>
    </el-row>
    <join-dialog
      :visible.sync="joinVisible"
      :title="$t('user.installer')"
      tag="installer">
    </join-dialog>
  </section>
</template>

<script>
import joinDialog from '@/views/product/joinDialog'
export default {
  name: 'user-info',
  components: { joinDialog },
  data () {
    return {
      invitCode: '',
      opText: '',
      joinVisible: false
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
        this.opText = result.code || ''
      }
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
    height: 22px;
    border-bottom: 1px solid #ccc;
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
