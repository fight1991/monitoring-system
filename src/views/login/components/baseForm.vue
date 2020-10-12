<template>
  <div class="login-register">
    <div class="form">
      <el-form ref="dataForm" size="small" label-width="120px" :model="dataForm" :rules="loginRules">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="account" :label="$t('login.username')">
              <el-popover
                :visible-arrow="false"
                trigger="focus"
                popper-class="login-pop"
                width="200"
                placement="right-end">
                <span>{{$t('login.tips1')}}</span>
                <el-input slot="reference" v-model="dataForm.account"></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="password">
            <el-form-item prop="password" :label="$t('login.pw')">
              <el-popover
                :visible-arrow="false"
                trigger="focus"
                popper-class="login-pop"
                width="200"
                placement="right">
                <span>{{$t('login.tips2')}}</span>
                <el-input slot="reference" :type="pwType" v-model="dataForm.password">
                  <i slot="suffix" @click="showPw('pwType')" :class="pwType === 'password'?'iconfont icon-hide':'iconfont icon-show'"></i>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="password">
            <el-form-item prop="verPw" :label="$t('login.verPw')">
              <el-input :type="pwType2" v-model="dataForm.confirmWord">
                <i slot="suffix" @click="showPw('pwType2')" :class="pwType2 === 'password'?'iconfont icon-hide':'iconfont icon-show'"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="email" :label="$t('login.em')">
              <el-input v-model="dataForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="find-btn">
      <div class="flex-center" style="padding-left: 120px">
        <el-checkbox v-model="isAgreen">
          <span class="agree-text f12">{{$t('login.agree')}}</span>
        </el-checkbox>
        <span class="user-agree f12" @click="openDialog">{{$t('login.server')}}</span>
      </div>
    </el-row>
    <el-dialog
      class="login-agree-dialog sys-dialog"
      :title="''"
      width="70%"
      :modal-append-to-body="false"
      :visible.sync="agreeVisible">
      <div class="iframe-view" v-loading="loading" :style="{'height': dialogH + 'px' }">
        <iframe  @load="load" :src="agreeSrc" frameborder="0" height="100%" width="100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '../mixin'
import valid from '../common/validate'
export default {
  name: 'register',
  mixins: [mixins],
  data () {
    return {
      agreeSrc: '',
      dialogH: window.innerHeight - 100,
      agreeVisible: false,
      loading: false,
      pwType: 'password',
      pwType2: 'password',
      isAgreen: true,
      dataForm: {
        account: '', // 用户名
        password: '', // 密码
        confirmWord: '', // 密码确认
        email: ''
      },
      loginRules: {
        account: [{ required: true, pattern: valid.user.rule, message: this.$t(valid.user.message), trigger: 'blur' }],
        password: [{ required: true, pattern: valid.password.rule, message: this.$t(valid.password.message), trigger: 'blur' }],
        verPw: [{ required: true, validator: this.verPwValid, trigger: 'blur' }],
        email: [{ pattern: valid.email.rule, message: this.$t(valid.email.message), trigger: 'blur' }]
      }
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.dialogH = window.innerHeight - 100
    })
    let vers = process.env.VUE_APP_VERSION === 'inside' ? 'zh_CN' : 'en'
    this.agreeSrc = process.env.VUE_APP_WWW + `/i18n/${vers}/UserAgreement.html`
  },
  beforeDestroy () {},
  methods: {
    load () {
      this.loading = false
    },
    // 打开用户协议窗口
    openDialog () {
      this.agreeVisible = true
    },
    showPw (type) {
      this[type] = this[type] === 'text' ? 'password' : 'text'
    },
    verPwValid (rule, value, callback) {
      let { password, confirmWord } = this.dataForm
      if (confirmWord !== password) {
        callback(new Error(this.$t('login.pwNot')))
      }
      callback()
    },
    // 校验用户基本信息
    async checkBaseInfo () {
      if (!this.isAgreen) {
        this.$message.warning('尚未勾选服务条款!')
        return false
      }
      let res1 = false
      this.$refs.dataForm.validate(v => (res1 = v))
      if (!res1) return false
      // 还需要校验账户有没有注册过
      let res2 = await this.checkAccountExsit()
      console.log(res2)
      return res2
    },
    // 发送请求校验用户是否已经注册过
    async checkAccountExsit () {
      let { result } = await this.$post({
        url: '/v0/user/check',
        data: {
          account: this.dataForm.account,
          email: this.dataForm.email
        }
      })
      return result
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../common/public';
  .user-agree {
    color: @sys-main-header;
  }
  .agree-text {
    color: #4c4c4c;
  }
  .login-register {
    width: 380px;
  }
</style>
