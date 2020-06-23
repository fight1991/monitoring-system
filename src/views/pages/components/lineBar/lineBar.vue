<template>
  <div class="power bg-c">
    <div class="header flex-between pd10">
      <div class="btn">
        <el-radio-group v-model="echartType" size="mini" @change="echartChange">
          <slot name="radioBtn"></slot>
        </el-radio-group>
      </div>
      <div class="date" v-show="echartType=='elec'">
        <el-dropdown size="mini" split-button @command="selectDateType">
          {{dateType}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="Days">Days</el-dropdown-item>
            <el-dropdown-item command="Months">Months</el-dropdown-item>
            <el-dropdown-item command="Years">Years</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="date-area">
          <i class="arrow el-icon-arrow-left" @click="computeDate('reduce')"></i>
          <el-date-picker
            @change="getBarData()"
            :clearable="false"
            size="mini"
            style="width:125px"
            :type="pickerDate[dateType]"
            :picker-options="pickerOptions"
            v-model="dateValue">
          </el-date-picker>
          <i class="arrow el-icon-arrow-right" @click="computeDate('add')"></i>
          </span>
      </div>
      <div class="date" v-show="echartType=='power'">
        <el-date-picker
          @change="getLineData()"
          :clearable="false"
          size="mini"
          style="width:125px"
          :picker-options="pickerOptions"
          v-model="powerDate">
        </el-date-picker>
      </div>
    </div>
    <!-- 图表 -->
    <div class="chart" v-show="echartType!=='list'">
      <el-echart :loading="chartLoading[echartType]" :datas="echartData[echartType]" height="350px"></el-echart>
    </div>
    <div v-show="echartType==='list'">
      <slot name="other"></slot>
    </div>
  </div>
</template>
<script>
import echartData from './echartData'
import { formatDate } from '@/util'
export default {
  mixins: [echartData],
  data () {
    return {
      dateValue: '',
      chartLoading: {
        power: false,
        elec: false
      },
      powerDate: formatDate(Date.now(), 'yyyy-MM-dd'),
      dateType: 'Days',
      echartType: 'power', // 默认显示功率图表
      reportType: {
        Days: 'day',
        Months: 'month',
        Years: 'year'
      },
      pickerDate: {
        Days: 'date',
        Months: 'month',
        Years: 'year'
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {},
  props: {
    id: {
      default: ''
    },
    type: {
      default: 'plant'
    }
  },
  created () {
    this.setDefaultTime()
  },
  mounted () {

  },
  methods: {
    echartChange (type) {

    },
    // 切换日期控件类型
    selectDateType (command) {
      this.dateType = command
      this.setDefaultTime()
      this.getBarData()
    },
    // 设置默认事件
    setDefaultTime () {
      let dateP = this.dateType === 'Days' ? 'yyyy-MM-dd' : this.dateType === 'Months' ? 'yyyy-MM' : 'yyyy'
      this.dateValue = formatDate(new Date(), dateP)
    },
    // 计算月份 年份
    computeDate (type) {
      let currentTime = new Date(this.dateValue)
      if (this.dateType === 'Days') { // 月份增减
        let tempMonth = type === 'reduce' ? currentTime.getMonth() - 1 : currentTime.getMonth() + 1
        let temp = currentTime.setMonth(tempMonth)
        let lastDate = new Date(temp)
        let lastYear = lastDate.getFullYear()
        let lastMonth = this.checkMonth(lastDate.getMonth() + 1)
        let showDate = lastYear + '-' + lastMonth
        if (new Date(showDate).getTime() > Date.now()) return
        this.dateValue = showDate
      } else { // 年份增减
        let tempYear = type === 'reduce' ? currentTime.getFullYear() - 1 : currentTime.getFullYear() + 1
        if (tempYear > new Date().getFullYear()) return
        this.dateValue = tempYear.toString()
      }
      // 发送请求
      this.getBarData()
    },
    // 小于10补0
    checkMonth (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    // 折现图表数据功率
    async getLineData (id) {
      this.chartLoading.power = true
      let params = {}
      if (this.type === 'plant') {
        params.plantID = id || this.id
      } else {
        params.deviceID = id || this.id
      }
      let { result } = await this.$axios({
        url: `/v0/${this.type}/history/raw`,
        isLoad: false,
        method: 'post',
        data: {
          ...params,
          variables: ['generationPower', 'feedinPower', 'loadsPower'],
          timespan: 'day',
          beginDate: {
            year: new Date(this.powerDate).getFullYear(),
            month: new Date(this.powerDate).getMonth() + 1,
            day: new Date(this.powerDate).getDate(),
            hour: 0,
            minute: 0,
            second: 0
          }
        }
      })
      if (result && result.length > 0) {
        this.echartData.power.legend.data = result.map(v => v.variable)
        this.echartData.power.series = result.map(v => {
          // 解决Date.parse在火狐浏览器中解析yyyy-MM-dd日期格式时返回NaN
          let tempData = v.data.map(item => [Date.parse(item.time.replace(/-/g, '/')), (item.value).toLocaleString()])
          return {
            symbol: 'none',
            type: 'line',
            name: v.variable,
            data: tempData,
            smooth: true,
            markPoint: {
              data: [
                { type: 'max', name: '最大值', itemStyle: { color: 'green' } },
                { type: 'min', name: '最小值', itemStyle: { color: '#F96867' } }
              ]
            }
          }
        })
      }
      this.chartLoading.power = false
      return true
    },
    // 柱状图表数据;电量统计
    async getBarData (id) {
      // let dateArr = this.dateValue.split('-')
      this.chartLoading.elec = true
      let params = {}
      if (this.type === 'plant') {
        params.plantID = id || this.id
      } else {
        params.deviceID = id || this.id
      }
      let { result } = await this.$axios({
        url: `/v0/${this.type}/history/report`,
        method: 'post',
        isLoad: false,
        data: {
          ...params,
          reportType: this.reportType[this.dateType],
          variables: ['feedin', 'generation', 'loads', 'gridConsumption'],
          queryDate: {
            year: new Date(this.dateValue).getFullYear(),
            month: new Date(this.dateValue).getMonth() + 1,
            day: new Date(this.dateValue).getDate(),
            hour: new Date(this.dateValue).getHours()
          }
        }
      })
      if (result && result.length > 0) {
        if (result[0].data && result[0].data.length > 0) {
          this.echartData.elec.xAxis.data = result[0].data.map(v => v.index)
        }
        this.echartData.elec.legend.data = result.map(v => v.variable)
        this.echartData.elec.series = result.map(v => {
          return {
            type: 'bar',
            name: v.variable,
            data: v.data
          }
        })
      }
      this.chartLoading.elec = false
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.power {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
}
.date-area {
  margin-left: 20px;
  .arrow {
    cursor: pointer;
    margin: 0 8px;
  }
}
</style>
