<template>
  <div class="login login-register">
    <div class="form">
      <el-form ref="dataForm" :model="dataForm" label-position="top" :rules="loginRules">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="user" :label="$t('login.username')">
              <el-popover
                :visible-arrow="false"
                trigger="focus"
                popper-class="login-pop"
                width="200"
                placement="right-end">
                <span>{{$t('login.tips1')}}</span>
                <el-input slot="reference" v-model="dataForm.user"></el-input>
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
              <el-input v-model="dataForm.email" @keyup.native.enter="goRegister"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row class="find-btn" type="flex" justify="space-between">
      <div>
        <el-checkbox v-model="isAgreen">
          <span class="agree-text f12">{{$t('login.agree')}}</span>
        </el-checkbox>
        <span class="user-agree f12" @click="openDialog">{{$t('login.server')}}</span>
      </div>
      <span @click="backLogin">{{$t('login.back')}}</span>
    </el-row>
    <!-- 注册按钮 -->
    <el-row class="login-btn">
      <el-button :disabled="!isAgreen" class="login-click" type="primary" @click="goRegister">{{$t('login.register')}}</el-button>
    </el-row>
    <el-dialog
      class="login-agree-dialog sys-dialog"
      :title="''"
      width="70%"
      :modal-append-to-body="false"
      :visible.sync="agreeVisible">
      <div class="iframe-view" v-loading="loading" :style="{'height': dialogH + 'px' }">
        <iframe  @load="load" src="http://8.209.116.72/i18n/zh_CN/UserAgreement.html" frameborder="0" height="100%" width="100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixins from './mixin'
import md5 from 'js-md5'
import valid from './validate'
import link from './link'
export default {
  name: 'register',
  mixins: [mixins],
  data () {
    return {
      dialogH: window.innerHeight - 100,
      agreeVisible: false,
      loading: false,
      pwType: 'password',
      pwType2: 'password',
      isAgreen: true,
      dataForm: {
        user: '', // 用户名
        password: '', // 密码
        confirmWord: '', // 密码确认
        email: ''
      },
      loginRules: {
        user: [{ required: true, pattern: valid.user.rule, message: this.$t(valid.user.message), trigger: 'blur' }],
        password: [{ required: true, pattern: valid.password.rule, message: this.$t(valid.password.message), trigger: 'blur' }],
        verPw: [{ required: true, validator: this.verPwValid, trigger: 'blur' }]
      }
    }
  },
  props: ['pageFlag'],
  computed: {
    contactType () {
      return this.isEmail ? 'email' : 'phone'
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.dialogH = window.innerHeight - 100
    })
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
    // 返回登录模块
    backLogin () {
      this.$emit('toggleStatus', 'login')
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
    // 注册按钮
    goRegister () {
      // 自定义表单校验
      let isPass = true
      this.$refs.dataForm.validate(valid => (isPass = valid))
      if (!isPass) return
      let tempData = { ...this.dataForm }
      this.$post({
        url: '/v0/user/register',
        data: {
          ...tempData,
          password: md5(tempData.password)
        },
        success: res => {
          // 1.注册成功, 调用自动登录接口 ? 2. 跳转到产品介绍页面
          // this.$router.push('/product/index')
          this.$message.success(this.$t('login.successMg1'))
          link.$emit('sendUser', this.dataForm.user)
          this.dataForm = {
            user: '',
            password: '',
            confirmWord: '',
            email: ''
          }
          this.backLogin()
        },
        other: res => {
          // 41801 用户名/邮箱/手机号已被注册
          if (res.errno === 41801) {
            this.dataForm.user = ''
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import './public';
  .user-agree {
    color: @sys-main-header;
  }
  .agree-text {
    color: #4c4c4c;
  }
</style>
