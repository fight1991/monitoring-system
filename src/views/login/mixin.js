import valid from './common/validate'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      timer: null,
      codeText: ''
    }
  },
  computed: {
    ...mapState({
      codeTxt (state) {
        if (this.codeText.includes('s')) {
          return this.codeText
        } else {
          return this.$t('login.send')
        }
      }
    })
  },
  methods: {
    // 判断是邮箱/手机号/用户名
    getAcountType (account) {
      if (valid.email.rule.test(account)) return 'email'
      if (valid.phone.rule.test(account)) return 'phone'
      if (valid.user.rule.test(account)) return 'user'
      return false
    },
    // 发送验证码
    async sendCode (user) {
      if (this.timer) return
      let { result } = await this.$post({
        url: '/c/v0/user/sendcaptcha',
        data: {
          user
        }
      })
      if (result) {
        this.$message.success('send successful')
        return true
      } else {
        return false
      }
    },
    // 验证码按钮
    codeBtn () {
      // 发送验证码请求
      if (this.timer) return false
      let secs = 60
      this.codeText = secs + 's'
      this.timer = setInterval(() => {
        secs--
        if (secs < 10 && secs > 0) {
          this.codeText = '0' + secs + 's'
        } else {
          this.codeText = secs + 's'
        }
        if (secs < 0) {
          this.clearTime()
        }
      }, 1000)
    },
    // 清除定时器
    clearTime () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
        this.codeText = this.$t('login.send')
      }
    }
  }
}
