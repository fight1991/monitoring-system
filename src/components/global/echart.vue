<template>
  <div class="echart-box">
    <div v-show="hasData" class="echart" ref="echart" :style="{'width':width,'height':height}"></div>
    <div v-show="!hasData" class="noData flex-column-center" :style="{'width':width,'height':height}">
      <p><i class="iconfont icon-noData"></i></p>
      <p>{{$t('common.noData')}}</p>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  name: 'e-chart',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    datas: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang,
      currentTab: state => state.tab.currentTab
    }),
    hasData () { // 是否有数据
      if (this.datas.series && this.datas.series.length > 0) {
        return this.datas.series.every(v => v.data && v.data.length > 0)
      } else {
        return false
      }
    }
  },
  watch: {
    datas: {
      handler: function () {
        this.asyncInit()
      },
      deep: true
    },
    lang: function () {
      this.asyncInit()
    },
    currentTab: function () {
      this.asyncInit()
    }
  },
  data () {
    return {}
  },
  created () {
    window.addEventListener('resize', this.asyncInit)
  },
  mounted () {
    this.asyncInit()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.asyncInit)
  },
  methods: {
    asyncInit () {
      this.$nextTick(() => {
        this.initEchart()
      })
    },
    initEchart () {
      // 获取DOM节点并初始化
      let chart = echarts.init(this.$refs.echart)
      // 设置图表的参数
      chart.setOption(this.datas, { notMerge: true })
      chart.resize()
    }
  }
}
</script>
<style lang="less" scoped>
.echart {
  overflow: hidden!important;
}
.noData {
  text-align: center;
  color: #ADE9F8;
  font-weight: bold;
  font-size: 16px;
  p {
    margin: 0;
    margin-bottom: 5px;
  }
  .icon-noData {
    font-weight: normal;
    height: 100%;
    font-size: 180px;
    color: #ADE9F8;
  }
}
</style>
