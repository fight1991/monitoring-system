<template>
  <section class="sys-main">
    <!-- 电站名称区域 -->
    <div class="block bg-c mg-b15">
      <div class="plant-head clearfix">
        <div class="plant-name flex-center fl">
          <i class="iconfont icon-nibianqi"></i>
          <div>
            <span>{{$t('common.invertSn')}} : {{headInfo.deviceSN || ''}}</span>
            <span>{{$t('plant.name')}} : {{headInfo.plantName || ''}}</span>
            <span>{{$t('common.datacolSN')}}  : {{headInfo.moduleSN || ''}}</span>
            <span>{{$t('common.InvType')}}  : {{headInfo.deviceType || ''}}</span>
            <span>{{$t('plant.equipSta')}} : {{headInfo.status || ''}}</span>
          </div>
        </div>
        <i @click="collapse=!collapse" v-show="!collapse" class="arrow-right fr el-icon-arrow-right"></i>
        <i @click="collapse=!collapse" v-show="collapse" class="arrow-right fr el-icon-arrow-down"></i>
      </div>
      <div :class="{'plant-item':true, 'height-0':!collapse}">
        <el-row :gutter="30">
          <el-col :span="6">{{$t('plant.country')}}  : {{headInfo.country || ''}}</el-col>
          <el-col :span="6">{{$t('plant.city')}} : {{headInfo.city || ''}}</el-col>
          <el-col :span="6">{{$t('inverter.InsTime')}}  : {{headInfo.feedinDate | formatDate('yyyy-MM-dd')}}</el-col>
          <el-col :span="6">{{$t('inverter.InvHV')}}  : {{headInfo.hardwareVersion || ''}}</el-col>
          <el-col :span="6">{{$t('inverter.InvMas')}} : {{headInfo.softVersion && headInfo.softVersion.master || ''}}</el-col>
          <el-col :span="6">{{$t('inverter.InvSla')}} : {{headInfo.softVersion && headInfo.softVersion.slaver || ''}}</el-col>
          <el-col :span="6">{{$t('inverter.InvMan')}} : {{headInfo.softVersion && headInfo.softVersion.manager || ''}}</el-col>
        </el-row>
      </div>
    </div>
    <!-- 设备状态 -->
    <device-status :incomeDetail="incomeDetail" :power="incomeDetail.power" :capacity="incomeDetail.systemCapacity" :title="$t('plant.equipSta')"></device-status>
    <!-- 今日异常 流向图 -->
    <div class="block">
      <el-row :gutter="15">
        <el-col :span="8">
          <today-abnormal :todayFault="todayFault" :type="'device'" :id="deviceId" :contentH="250"></today-abnormal>
        </el-col>
        <el-col :span="16">
          <el-card shadow="never">
            <div class="title border-line" slot="header">
              <!-- Flow graph -->
              {{$t('inverter.powerFD')}}
              <i class="fr el-icon-more flow-icon-more" @click="flowDialog=true"></i>
            </div>
            <div class="flow-map flex-center" style="height:250px">
              <flow-animate :path="flowPath" :pvValue="pvTotal"></flow-animate>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 功率折线图和电量统计柱状图 -->
    <div class="container-bottom bg-c">
      <line-bar :id="deviceId" :type="'device'" ref="lineBar">
        <template v-slot:radioBtn>
          <el-radio-button label="power">{{$t('common.power')}}</el-radio-button>
          <el-radio-button label="elec">{{$t('common.gene')}}</el-radio-button>
        </template>
      </line-bar>
    </div>
    <!-- 多选折线图 -->
    <div class="container-bottom bg-c">
      <el-row class="select-line">
        <el-select v-model="multiValue" collapse-tags multiple size="mini" :placeholder="$t('common.select')" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item"
            :label="$t('chart.'+item)"
            :value="item">
          </el-option>
        </el-select>
      </el-row>
      <el-echart :datas="lineChart" height="300px"></el-echart>
    </div>
    <flow-dialog :visible.sync="flowDialog" :tabList="flowDetail"></flow-dialog>
  </section>
</template>
<script>
import todayAbnormal from '@/views/pages/plant/todayAbnormal'
import deviceStatus from '@/views/pages/components/powerStatus'
import lineBar from '@/views/pages/components/lineBar/lineBar'
import flowDialog from './flowDialog'
import flowAnimate from './flowAnimate'
import lineChart from './lineChart'
import storage from '@/util/storage'
import { isJSON } from '@/util'
export default {
  components: {
    deviceStatus,
    lineBar,
    todayAbnormal,
    flowDialog,
    flowAnimate
  },
  mixins: [lineChart],
  data () {
    return {
      flowPath: 0,
      flowDetail: [],
      pvTotal: 0,
      ws: null,
      wsIsOpen: false,
      todayFault: 0,
      flowDialog: false,
      collapse: false,
      abnormalVisible: false,
      multiValue: [],
      deviceId: '',
      options: [],
      headInfo: {},
      incomeDetail: { // 收益详情
        currencyCount: 0, // 币种数量
        power: '', // 功率
        generation: {
          today: 0,
          month: 0,
          year: 0,
          cumulate: 0
        },
        earnings: {
          cumulate: [
            {
              currency: '-',
              value: 0
            }
          ]
        }
      },
      setWsHead ({ flag = '', url = '', data = {} }) {
        return JSON.stringify({
          token: storage.getToken(),
          msgType: 'request',
          interval: 3000,
          sequence: flag,
          parameters: data,
          resource: url
        })
      }
    }
  },
  created () {
    this.deviceId = this.$route.query.id
    this.getHeadInfo()
    this.getOptions()
    this.getAbnormalStatus()
    this.getDeviceEarns()
    this.createWebsocket(this.getWsInfo)
  },
  mounted () {
    this.$refs.lineBar.getLineData()
    this.$refs.lineBar.getBarData()
  },
  watch: {
    wsIsOpen (newData) {
      if (newData) {
        this.ws.send(this.setWsHead({
          flag: 'flowDetail',
          url: '/c/v0/device/real/all',
          data: {
            deviceID: this.deviceId
          }
        }))
        this.ws.send('\r\n')
        this.ws.send(this.setWsHead({
          flag: 'flow',
          url: '/c/v0/device/real/flow',
          data: {
            deviceID: this.deviceId
          }
        }))
        this.ws.send('\r\n')
      }
    }
  },
  beforeDestroy () {
    this.ws && this.ws.close()
  },
  methods: {
    // 获取头部逆变器信息
    async getHeadInfo () {
      let { result } = await this.$axios({
        url: '/v0/device/addressbook',
        data: {
          deviceID: this.deviceId
        }
      })
      this.headInfo = result || {}
    },
    // 获取单个设备功率的发电和收益情况
    async getDeviceEarns () {
      let { result } = await this.$axios({
        url: '/v0/device/earnings',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.incomeDetail.power = result.power
        this.incomeDetail.currencyCount = 0
        this.incomeDetail.generation.today = result.today.generation
        this.incomeDetail.generation.month = result.month.generation
        this.incomeDetail.generation.cumulate = result.cumulate.generation
        this.incomeDetail.earnings.cumulate = [
          {
            currency: result.currency,
            value: result.cumulate.earnings
          }
        ]
      }
    },
    // 获取图表下拉选择框
    async getOptions () {
      let { result } = await this.$axios({
        url: '/v0/device/variables',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.options = result.variables || []
      }
    },
    // 多折线图表
    async getMultiChart () {
      let { result } = await this.$axios({
        url: '/v0/device/history/raw',
        method: 'post',
        data: {
          deviceID: this.deviceId,
          variables: this.multiValue,
          timespan: 'hour',
          beginDate: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            hour: new Date().getHours(),
            minute: new Date().getMinutes(),
            second: new Date().getSeconds()
          }
        }
      })
      if (result && result.length > 0) {
        let temp = []
        result.forEach((v, i) => {
          let tempData = v.data.map(item => [Date.parse(item.time), item.value])
          temp.push({
            name: v.variable,
            data: tempData,
            type: 'line',
            smooth: true
          })
          this.lineChart.series = temp
        })
      }
      return true
    },
    // 获取今日异常
    async getAbnormalStatus () {
      let { result } = await this.$axios({
        url: '/v0/device/alarm/today',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.todayFault = result.total || 0
      }
      return true
    },
    selectChange () {
      if (!this.multiValue) return
      this.lineChart.legend.data = this.multiValue
      this.getMultiChart()
    },
    // 创建websocket
    createWebsocket (callback) {
      if (this.ws) return
      if (!window.WebSocket) {
        this.$message.error(`your brower can't support websocket, please go to update`)
        return
      }
      let ws = new WebSocket(process.env.VUE_APP_SOCKET)
      this.ws = ws
      let that = this
      ws.onopen = function () {
        that.wsIsOpen = true
      }
      ws.onclose = function () {
        that.wsIsOpen = false
      }
      ws.onerror = function () {
        that.wsIsOpen = false
      }
      ws.onmessage = function (e) {
        if (isJSON(e.data)) {
          let temp = JSON.parse(e.data)
          if (temp.msgType === 'response') { // 响应成功与否
            if (temp.errno === 0) {
              // console.log('参数发送成功')
            } else {
              console.log('错误码' + temp.errno)
            }
          }
          if (temp.msgType === 'data') {
            callback && callback(temp)
          }
        } else {}
      }
    },
    // 获取ws信息
    getWsInfo (res) {
      if (res.sequence === 'flowDetail') {
        this.flowDetail = res.data.blocks || []
      }
      if (res.sequence === 'flow') {
        let data = res.data
        let pvValue = 0
        this.pvTotal = 0
        let { pvPower, generationPower, loadsPower, feedinPower, gridConsumptionPower } = data
        if (pvPower && pvPower.length > 0) {
          let flag = pvPower.some(v => v.value > 0)
          flag && (pvValue = 1)
          pvPower.forEach(v => {
            this.pvTotal += v.value
          })
        }
        this.flowPath = this.getFlowPath(pvValue, generationPower.value, loadsPower.value, feedinPower.value, gridConsumptionPower.value)
      }
    },
    // 计算得出流向图路径
    getFlowPath (pvValue, generationPower, loadsPower, feedinPower, gridConsumptionPower) {
      let tag1 = pvValue > 0 && generationPower > 0 && (feedinPower + generationPower) > 0
      let tag2 = pvValue > 0 && generationPower > 0 && (feedinPower + generationPower) < 0
      if (tag1 && feedinPower < 0) {
        return 1
      } else if (tag1 && feedinPower > 0) {
        return 2
      } else if (tag2 && feedinPower < 0) {
        return 3
      } else if (feedinPower > 0 && (generationPower + feedinPower) > 0) {
        return 4
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '../components/plantInvert';
.flow-icon-more {
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.container-bottom {
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.select-line {
  padding:10px;
  border-bottom:1px solid #f5f5f5;
}
</style>
