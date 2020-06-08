<template>
  <div class="container">
    <!-- 头部区域 -->
    <div class="header flex-between">
      <div class="header-left flex-start">
        <img :src="logoImg" alt="">
        <span class="company-name">FoxESS</span>
      </div>
      <div class="header-right flex-start">
        <div class="join-us"><i class="iconfont icon-hand-right"></i>{{$t('join.joinUs')}}</div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="banxin">
        <el-card shadow="always">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="1">
            <template slot="title">
              <span class="collape-item user"><i class="iconfont icon-end-user"></i> {{$t('join.endUser')}}</span>
            </template>
            <div class="op-click" @click="userClick"><i class="iconfont icon-new"></i> {{$t('join.create')}}</div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <span class="collape-item installer"><i class="iconfont icon-installer"></i> {{$t('join.installer')}}</span>
            </template>
            <!-- <div class="op-click" @click="installerClick('add')"><i class="iconfont icon-new"></i> {{$t('join.create')}}</div> -->
            <div class="op-click" @click="installerClick"><i class="iconfont icon-join"></i> {{$t('join.join')}}</div>
          </el-collapse-item>
          <el-collapse-item title="Agent" name="3">
            <template slot="title">
              <span class="collape-item agent"><i class="iconfont icon-agent"></i> {{$t('join.agent')}}</span>
            </template>
            <div class="op-click" @click="agentClick('add')"><i class="iconfont icon-new"></i> {{$t('join.create')}}</div>
            <div class="op-click" @click="agentClick('join')"><i class="iconfont icon-join"></i> {{$t('join.join')}}</div>
          </el-collapse-item>
        </el-collapse>
        </el-card>
      </div>
    </div>
    <!-- 底部区域 -->
    <div class="footer">
      <div class="rights-info">
        {{$store.state.rightsTxt + $t('login.allRight')}}
      </div>
    </div>
    <!-- 注册或加入 -->
    <submit-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :organList="organList"
      :tag="tag">
    </submit-dialog>
    <join-dialog
      :visible.sync="joinVisible"
      :title="dialogTitle"
      :organList="organList"
      :tag="tag">
    </join-dialog>
  </div>
</template>

<script>
import submitDialog from './submitDialog'
import joinDialog from './joinDialog'
export default {
  components: {
    submitDialog,
    joinDialog
  },
  data () {
    return {
      activeName: '1',
      dialogTitle: '',
      tag: '', // user agent installer
      dialogVisible: false,
      joinVisible: false,
      organList: [],
      logoImg: require('@/assets/logo.png')
    }
  },
  computed: {},
  created () {},
  methods: {
    userClick () {
      if (this.access) {
        this.tips()
        return
      }
      this.dialogTitle = this.$t('join.newUser')
      this.tag = 'user'
      this.joinVisible = true
    },
    installerClick () {
      // if (this.access) {
      //   this.tips()
      //   return
      // }
      this.dialogTitle = this.$t('join.newInst')
      this.tag = 'installer'
      this.joinVisible = true
      this.getOrgansList('agent')
    },
    agentClick (command) {
      if (this.access) {
        this.tips()
        return
      }
      this.getOrgansList('agent')
      if (command === 'add') {
        this.dialogTitle = this.$t('join.newAgent')
        this.dialogVisible = true
      } else {
        this.dialogTitle = this.$t('join.existAgent')
        this.joinVisible = true
      }
      this.tag = 'agent'
    },
    tips () {
      this.$notify({
        title: 'warning',
        message: 'You have created the organization',
        offset: 100,
        type: 'warning'
      })
    },
    // 获取组织列表
    async getOrgansList (tag) {
      let { result } = await this.$axios({ url: '/v0/organs/list', data: { organType: tag } })
      this.organList = result || []
    }
  }
}
</script>

<style lang="less" scoped>
.banner img {
  width: 100%;
}
.container {
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-color: rgba(125, 172, 200);
  .header {
    width: 80%;
    margin: 0 auto;
    padding: 20px 40px;
    margin-bottom: 20px;
  }
  .header-right {
    .iconfont {
      font-size: 22px;
      margin-right: 10px;
      display: inline-block;
      transform: rotate(90deg);
    }
    padding-right: 15px;
    font-size: 1.5rem;
  }
  .header-left {
    img {
      width: 50px;
    }
  }
  .company-name {
    margin-left: 10px;
    font-size: 1.5rem;
  }
  .join-us {
    font-weight: bold;
    color: @sys-main-header;
  }
  .collape-item {
    font-size: 16px;
    font-weight: bold;
    .iconfont {
      font-size: 22px;
      margin-right: 5px;
    }
    &.user {
      color: #E6A23C;
    }
    &.installer {
      color: #67C23A;
    }
    &.agent {
      color: #F56C6C;
    }
  }
  .op-click {
    text-indent: 30px;
    cursor: pointer;
    padding: 8px 0;
    margin: 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #009BE2;
    background:linear-gradient(to right,#99bae4 0% #009BE2 5%,#99bae4 80%, #fff 100%);
  }
  .content {
    flex: 1;
    .banxin {
      width: 80%;
      margin: 0 auto;
    }
  }
  .footer {
    height: 100px;
    background-color: #fff;
    text-align: center;
    .rights-info {
      padding-top: 20px;
      opacity: 0.5
    }
  }
}
</style>
