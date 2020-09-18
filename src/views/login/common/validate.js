export default {
  email: {
    rule: /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$|^$/, // 邮箱或为空
    message: 'login.errorMg3'
  },
  phone: {
    rule: /^\d+$/, // 手机号
    message: 'login.errorMg2'
  },
  user: {
    rule: /^[A-Za-z0-9]{4,20}$/, // 4 - 20 位字符，可由英文字母及数字组成
    message: 'login.errorMg4'
  },
  password: {
    rule: /^[A-Za-z0-9_]{6,20}$/, // 6 - 20位字符，可由英文字母、数字以及“ _"组成
    message: 'login.errorMg5'
  },
  code: {
    rule: /^\d{4}$/, // 验证码
    message: 'login.errorMg6'
  }
}
