<template>
  <div class="login">
    <div class="form">
      <el-form ref="dataForm" :model="dataForm" label-width="0px" :rules="loginRules">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-input v-model="dataForm.user" :placeholder="$t('login.username')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="password">
            <el-form-item prop="pw">
              <el-input ref="password" :type="pwType" v-model="dataForm.password" :placeholder="$t('login.pw')" @keyup.native.enter="goLogin">
                <i slot="suffix" @click="showPw" :class="pwType === 'password'?'iconfont icon-hide':'iconfont icon-show'"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="forgot-pw" type="flex" justify="space-between">
      <span @click="registerBtn('register')">{{$t('login.register')}}</span>
      <span @click="registerBtn('resetPw')">{{$t('login.forgetPw')}}</span>
    </el-row>
    <el-row class="login-btn">
      <el-button class="login-click" type="primary" @click="goLogin">{{$t('login.login')}}</el-button>
    </el-row>
  </div>
</template>

<script>
import md5 from 'js-md5'
import mixins from './mixin'
import valid from './validate'
import storage from '@/util/storage'
import link from './link'
export default {
  name: 'login',
  mixins: [mixins],
  data () {
    return {
      pwType: 'password',
      loginType: 'code',
      isCode: false,
      isPw: true,
      isEmail: false,
      areaNum: [ { num: '+86', contry: 'china' } ],
      dataForm: {
        user: '',
        password: ''
      },
      loginRules: {}
    }
  },
  created () {
    link.$on('sendUser', this.getUserFromRegister)
    if (this.$route.query.type === 'reset') { // 系统header>重置密码按钮>重置面板>重置成功>登录面板显示
      this.dataForm.user = sessionStorage.getItem('username') || ''
    }
  },
  computed: {},
  methods: {
    getUserFromRegister (user) {
      this.dataForm.user = user
      this.$nextTick(() => {
        this.$refs.password && this.$refs.password.$refs.input.focus()
      })
    },
    // 用户名密码登录输入框校验
    passwordValid () {
      // 手机或邮箱正则
      let { user, password } = this.dataForm
      if (!valid.user.rule.test(user)) {
        this.$message.error(this.$t(valid.user.message))
        return false
      }
      if (!valid.password.rule.test(password)) {
        this.$message.error(this.$t(valid.password.message))
        return false
      }
      return true
    },
    showPw () {
      this.pwType = this.pwType === 'text' ? 'password' : 'text'
    },
    // 打开注册组件/密码找回
    registerBtn (type) {
      this.clearTime()
      this.$emit('toggleStatus', type)
    },
    // 登录
    goLogin () {
      // 自定义表单校验
      if (!this.passwordValid()) return false
      this.dataForm.accountType = this.accountType
      let tempData = { ...this.dataForm }
      this.$post({
        url: '/v0/user/login',
        data: {
          ...tempData,
          password: md5(tempData.password)
        },
        success: ({ result }) => {
          storage.setToken(result.token)
          // this.getUserInfo()
          // 存储权限信息
          this.$store.commit('setAccess', result.access)
          let path = '/'
          if (result.access === 0) { // 游客
            path = '/product/index'
          } else {
            path = this.$route.query.redirect || '/bus/dataView'
          }
          this.$router.push(path)
        },
        other: res => {
          // 41805 账号不存在 打开注册页面
          // 41807 用户名或密码错误
          if (res.errno === 41805) {
            this.registerBtn('register')
            return false
          }
          // 若验证码登录则 41900 41901 41902验证码已失效, 验证码错误 验证码不存在
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import './public';
  .find-btn {
    color: #3883c2;
    font-size: 14px;
  }
  .phone-area {
    border-right: none;
  }
</style>
