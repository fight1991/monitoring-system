import { mapState } from 'vuex'
import { translateRole } from '@/util'
export default {
  data () {
    return {
      showHsearch: false, // 是否显示高级查询
      setDivH: window.innerHeight - 116 // 容器高度
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.setDivH = window.innerHeight - 116
    })
  },
  computed: {
    ...mapState({ // 0 游客， 1 终端用户 ，2 安装商 3 代理商 ，255 厂商
      access: state => state.access
    }),
    roleName () {
      return this.$t(translateRole(this.access))
    }
  },
  methods: {
    // 翻译状态
    translateStatus (num) {
      let value = ''
      switch (Number(num)) {
        case 1:
          value = this.$t('common.normal')
          break
        case 2:
          value = this.$t('common.abnormal')
          break
        default:
          value = this.$t('common.offline')
          break
      }
      return value
    },
    // 获取国家列表
    async getCountryList () {
      let { result } = await this.$get({
        url: '/c/v0/map/countries',
        checkParams: this.$store.state.lang === 'zh_CN' ? 'country_zh' : 'country_en'
      })
      if (result) {
        return result.countries || []
      } else {
        return []
      }
    },
    // 保留2位有效小数
    toFixed (data, abs, num = 2) {
      if (!data || isNaN(Number(data))) return 0
      let temp = Number(data)
      if (Math.abs(temp) < 0.01) { // 防止出现-0.002 --> -0.00
        return 0
      }
      if (abs) {
        return Math.abs(temp.toFixed(num))
      }
      return temp.toFixed(num)
    },
    // 校验提示
    messageValid (type) {
      return this.$t('common.' + type)
    }
  }
}
