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
          value = '正常'
          break
        case 2:
          value = '故障'
          break
        default:
          value = '离线'
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
      if (!data) return 0
      let tempNum = data.toFixed(num)
      if (Number(tempNum) > 0) {
        return tempNum
      } else {
        return 0
      }
    }
  }
}
