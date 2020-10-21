<template>
  <section class='sign-up'>
    <div class="bg-wall"></div>
    <div class="content-box">
      <ul class="tab-header">
        <li
          v-for="(item, index) in tabsList"
          :class="{active: item.active}"
          :key="item.id">
          <span class="step-num">{{index + 1}}</span>
          {{$t(item.label)}}
        </li>
      </ul>
      <div class="tab-content">
        <div v-show="stepIndex==0" class="tab-item choose-role" @click="chooseRole">
          <div class="role" data-role="1">
            <div class="role-icon"><i class="iconfont icon-end-user"></i></div>
            <div class="role-txt">{{$t('join.endUser')}}</div>
          </div>
          <div class="role" data-role="2">
            <div class="role-icon"><i class="iconfont icon-installer"></i></div>
            <div class="role-txt">{{$t('join.installer')}}</div>
          </div>
          <div class="role" data-role="3">
            <div class="role-icon"><i class="iconfont icon-agent"></i></div>
            <div class="role-txt">{{$t('join.agent')}}</div>
          </div>
        </div>
        <div v-show="stepIndex==1" class="tab-item">
          <div class="base-info">
            <component ref="baseInfo" :is="$options.components.baseForm"></component>
            <el-row style="width:100%" type="flex" justify="end">
              <div class="btn">
                <el-button style="width: 100%" type="primary" size="mini" @click="checkBaseForm">{{$t('join.next')}}</el-button>
              </div>
            </el-row>
            <el-row style="width:100%" type="flex" justify="end">
              <div class="f12 rechoose" @click="stepIndex=0">{{$t('join.reselUser')}}</div>
            </el-row>
          </div>
        </div>
        <div v-show="stepIndex==2" class="tab-item">
          <div class="all-info">
            <userForm ref="endForm" v-if="currentRole==1"></userForm>
            <installerForm ref="endForm" v-if="currentRole==2"></installerForm>
            <agentForm ref="endForm" v-if="currentRole==3"></agentForm>
            <el-row v-if="currentRole==3" style="width:100%" type="flex" justify="end">
              <div class="btn">
                <el-button style="width: 100%" type="primary" size="mini" @click="endNextBtn">{{$t('join.next')}}</el-button>
              </div>
            </el-row>
            <el-button v-else style="width: 100%; margin-top:10px" type="primary" size="mini" @click="endNextBtn">{{$t('join.next')}}</el-button>
          </div>
        </div>
        <div v-show="stepIndex==3" class="tab-item">
          <div class="success-icon"><i class="el-icon-success"></i></div>
          <div class="flex-center">
            <span class="sign-up-text">{{$t('join.regSucc')}}</span>
            <span class="go-login" @click="$router.replace('/login')">{{$t('join.login')}}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { deepCopy } from '@/util'
import md5 from 'js-md5'
import baseForm from './components/baseForm'
import userForm from './components/userForm'
import agentForm from './components/agentForm'
import installerForm from './components/installerForm'
export default {
  name: 'sign-up',
  components: { baseForm, userForm, agentForm, installerForm },
  data () {
    return {
      stepIndex: 0,
      currentRole: 1, // 选择的用户类型
      tabHeader: [
        {
          id: 'type',
          label: 'join.selUser',
          active: true
        },
        {
          id: 'account',
          label: 'join.regACC',
          active: false
        },
        {
          id: 'info',
          label: 'join.perInfor',
          active: false
        },
        {
          id: 'done',
          label: 'join.regCom',
          active: false
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {
    tabsList () {
      return this.tabHeader.map((v, i) => {
        i <= this.stepIndex ? v.active = true : v.active = false
        return v
      })
    },
    roleName () {
      switch (this.currentRole) {
        case 2:
          return 'installer'
        case 3:
          return 'agent'
        default:
          return 'user'
      }
    }
  },
  methods: {
    // 选择用户类型
    chooseRole (e) {
      let role = e.target.dataset.role
      if (!role) return
      this.currentRole = Number(role)
      this.stepIndex = 1
    },
    // 上一步
    prevStep () {
      this.stepIndex--
    },
    // 下一步
    nextStep () {
      this.stepIndex++
    },
    // 校验基本信息表单
    async checkBaseForm () {
      let res = await this.$refs.baseInfo.checkBaseInfo()
      if (res) {
        this.nextStep()
      }
    },
    // 步骤3中的下一步
    async endNextBtn () {
      // 校验完善信息的表单
      let res = await this.$refs.endForm.checkForm()
      if (!res) return
      // 发送请求
      this.submitTotalForm()
    },
    // 表单提交
    async submitTotalForm () {
      let accountInfo = deepCopy(this.$refs.baseInfo.dataForm)
      let dataForm = deepCopy(this.$refs.endForm.baseForm)
      accountInfo.password = md5(accountInfo.password)
      accountInfo.type = this.roleName
      let dataKey = this.roleName + 'Info'
      let { result } = await this.$post({
        url: '/v1/user/register',
        data: {
          accountInfo,
          [dataKey]: dataForm
        }
      })
      if (result) {
        localStorage.setItem('account', accountInfo.account)
        this.nextStep()
      }
    }
  }
}
</script>
<style lang='less'>
//@import url(); 引入公共css类
.sign-up {
  overflow-y: auto;
  height: 100%;
  .bg-wall {
    height: 280px;
    background: linear-gradient(to bottom, #d3ebf5 0%, #fafcfd 40%);
  }
  .choose-role {
    box-sizing: border-box;
    padding-top: 100px;
    display: flex;
    justify-content: space-around;
  }
  .content-box {
    box-shadow: 0 2px 2px 0px rgba(0,0,0,.1);
    margin: -200px auto 0;
    width: 70%;
    min-width: 800px;
    // margin-top: 100px;
    .tab-header {
      display: flex;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      li {
        // font-size: 16px;
        list-style: none;
        width: 50%;
        text-align: center;
        padding: 10px 0;
        color: #fff;
        background-color: #a7acb5;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #ccc;
        &:last-child {
          border-right: none;
        }
        .step-num {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          text-align: center;
          margin-right: 15px;
          line-height: 18px;
          border: 1px solid #fff;
        }
        &.active {
          background-color: @sys-main-header;
        }
      }
    }
    .tab-content {
      height: 500px;
      background-color: #fff;
    }
    .base-info, .all-info{
      padding-top: 30px;
      margin: 0 auto;
    }
    .base-info {
      width: 380px;
    }
    .all-info {
      width: 380px;
    }
    .tab-item {
      .sign-up-text {
        font-weight: 700;
        padding-right:10px;
      }
      .go-login {
        color: @sys-main-header;
        cursor: pointer;
      }
      .success-icon {
        padding-top: 20px;
        font-size: 80px;
        text-align: center;
        color: #67C23A;
      }
      .btn,.rechoose {
        width: 230px;
      }
      .btn {
        box-sizing: border-box;
        margin: 20px 0 15px;
      }
      .rechoose {
        text-align: center;
        color: @sys-main-header;
        cursor: pointer;
      }
      height: 100%;
      .role {
        width: 150px;
        height: 170px;
        border: 1px solid #f5f5f5;
        text-align: center;
        color: #fff;
        border-radius: 3px;
        transition: all .5s;
        cursor: pointer;
        color: #fff;
        text-shadow: 1px 1px 1px #444;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        &:nth-child(1) .role-txt {
          background: #0091ea;
        }
        &:nth-child(2) .role-txt {
          background: #41b883;
        }
        &:nth-child(3) .role-txt {
          background: #FD803E;
        }
        .iconfont {
          font-size: 80px;
        }
        .role-icon,.role-txt{
          pointer-events: none;
        }
        .role-icon {
          height: 140px;
          line-height: 140px;
        }
        .role-txt {
          height: 30px;
          line-height: 30px;
          color: #fff;
        }
        &:hover {
          transform: translateY(-8px) scale(1.1);
          box-shadow: 1px 4px 5px 2px #ccc;
        }
        &:nth-child(1) {
          color: #0091ea;
        }
        &:nth-child(2) {
          color: #41b883;
        }
        &:nth-child(3) {
          color: #FD803E;
        }
      }
    }
  }
}

</style>
