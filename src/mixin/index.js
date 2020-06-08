import { mapState } from 'vuex'
export default {
  data () {
    return {
      setDivH: window.innerHeight - 150 // 容器高度
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.setDivH = window.innerHeight - 150
    })
  },
  computed: {
    ...mapState({ // 0 游客， 1 终端用户 ，2 安装商 3 代理商 ，255 厂商
      access: state => state.access
    })
  },
  methods: {
    backRoute (router) {
      this.$store.dispatch('backGo', router)
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
    }
  }
}
