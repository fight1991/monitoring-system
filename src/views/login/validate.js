export default {
  email: {
    rule: /^([A-Za-z0-9_\-\\.])+\\@([A-Za-z0-9_\-\\.])+\.([A-Za-z]{2,4})$/, // 邮箱
    message: 'login.errorMg3'
  },
  phone: {
    rule: /^\d+$/, // 手机号
    message: 'login.errorMg2'
  },
  user: {
    rule: /^[A-Za-z][A-Za-z0-9_-]{4,}$/, // 以字母开头的至少5位用户名
    message: 'login.errorMg4'
  },
  password: {
    rule: /^[A-Za-z0-9_&$#]{6,}$/, // 至少六位数密码
    message: 'login.errorMg5'
  },
  code: {
    rule: /^\d{4}$/, // 验证码
    message: 'login.errorMg6'
  }
}
