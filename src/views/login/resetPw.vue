<template>
  <div class="login login-register">
    <div class="form">
      <el-form ref="dataForm" :model="dataForm" label-position="top" :rules="loginRules">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="user" :label="$t('login.username')">
              <el-input v-model="dataForm.user"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="24" class="password">
            <el-form-item prop="newPassword" :label="$t('login.newPw')">
              <el-popover
                :visible-arrow="false"
                trigger="focus"
                popper-class="login-pop"
                width="200"
                placement="left">
                <span>{{$t('login.tips2')}}</span>
                <el-input slot="reference" :type="pwType" v-model="dataForm.newPassword">
                  <i slot="suffix" @click="showPw('pwType')" :class="pwType === 'password'?'iconfont icon-hide':'iconfont icon-show'"></i>
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="code-area">
            <el-form-item prop="captcha" :label="$t('login.code')">
              <el-input style="padding-top:4px" v-model="dataForm.captcha" :maxlength="4" @keyup.native.enter="resetPassword">
                <el-button slot="append" @click="getCode">{{codeTxt}}</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="find-btn" type="flex" justify="end">
      <span class="f12" @click="backLogin">{{$t('login.back')}}</span>
    </el-row>
    <el-row class="login-btn">
      <el-button class="login-click" type="primary" @click="resetPassword">{{$t('login.resetPw')}}</el-button>
    </el-row>
  </div>
</template>

<script>
import mixins from './mixin'
import md5 from 'js-md5'
import valid from './validate'
import link from './link'
export default {
  name: 'resetPw',
  mixins: [mixins],
  data () {
    return {
      pwType: 'password',
      isAgreen: true,
      dataForm: {
        newPassword: '', // 密码
        user: '', // 类型 email, phone
        captcha: '' // 验证码
      },
      loginRules: {
        user: [{ required: true, pattern: valid.user.rule, message: this.$t(valid.user.message), trigger: 'blur' }],
        newPassword: [{ required: true, pattern: valid.password.rule, message: this.$t(valid.password.message), trigger: 'blur' }],
        captcha: [{ required: true, pattern: valid.code.rule, message: this.$t(valid.code.message), trigger: 'blur' }]
      }
    }
  },
  computed: {
    accountType () {
      return this.isEmail ? 'email' : 'phone'
    }
  },
  created () {
    // 从系统重置密码跳转过来
    if (this.$route.query.type === 'reset') {
      this.dataForm.user = sessionStorage.getItem('username') || ''
    }
  },
  props: ['pageFlag'],
  methods: {
    // 返回登录模块
    backLogin () {
      this.$emit('toggleStatus', 'login')
    },
    showPw (type) {
      this[type] = this[type] === 'text' ? 'password' : 'text'
    },
    getCode () {
      this.$refs.dataForm.validateField('user', (valid) => {
        if (!valid) {
          this.sendCode(this.dataForm.user, this.codeBtn)
        }
      })
    },
    // 重置密码
    resetPassword () {
      let isPass = true
      this.$refs.dataForm.validate(valid => (isPass = valid))
      if (!isPass) return
      let tempData = { ...this.dataForm }
      this.$post({
        url: '/v0/user/reset',
        data: {
          ...tempData,
          newPassword: md5(tempData.newPassword)
        },
        success: res => {
          this.$message.success(this.$t('login.successMg2'))
          link.$emit('sendUser', this.dataForm.user)
          this.dataForm = {
            user: '',
            newPassword: '',
            captcha: ''
          }
          this.clearTime()
          this.backLogin()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import './public';
  .find-btn {
    padding-top: 5px;
  }
</style>
