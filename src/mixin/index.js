import { mapState } from 'vuex'
export default {
  data () {
    return {
      setDivH: window.innerHeight - 130 // 容器高度
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.setDivH = window.innerHeight - 130
    })
  },
  computed: {
    ...mapState({ // 0 游客， 1 终端用户 ，2 安装商 3 代理商 ，255 厂商
      access: state => state.access
    })
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
      let { result } = await this.$axios({
        url: '/v0/map/countries',
        checkParams: this.$store.state.lang === 'en' ? 'country_en' : 'country_zh'
      })
      if (result) {
        return result.countries || []
      } else {
        return []
      }
    },
    // 保留2位有效小数
    toFixed (data, num = 2) {
      if (!data || isNaN(Number(data))) return 0
      let temp = Number(data)
      if (Math.abs(temp) < 0.01) { // 防止出现-0.002 --> -0.00
        return 0
      }
      return temp.toFixed(num)
    }
  }
}
