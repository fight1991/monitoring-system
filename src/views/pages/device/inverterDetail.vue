<template>
  <section class="sys-main">
    <!-- 电站名称区域 -->
    <div class="block bg-c show-shadow mg-b12">
      <div class="plant-head clearfix">
        <div class="plant-name flex-center">
          <i class="iconfont icon-flow-invert"></i>
          <div class="line-center">
            <div class="text-cut item" :title="headInfo.deviceSN || ''">{{$t('common.invertSn')}} : {{headInfo.deviceSN || ''}}</div>
            <div class="text-cut item" :title="headInfo.plantName || ''">{{$t('plant.name')}} : {{headInfo.plantName || ''}}</div>
            <div class="text-cut item" :title="headInfo.moduleSN || ''">{{$t('common.datacolSN')}} : {{headInfo.moduleSN || ''}}</div>
            <div class="text-cut item" :title="headInfo.deviceType || ''">{{$t('common.InvType')}} : {{headInfo.deviceType || ''}}</div>
            <div class="text-cut item" :title="translateStatus(headInfo.status) || ''">{{$t('plant.equipSta')}} : {{translateStatus(headInfo.status) || ''}}</div>
          </div>
          <i @click="collapse=!collapse" v-show="!collapse" class="arrow-right fr el-icon-arrow-right"></i>
          <i @click="collapse=!collapse" v-show="collapse" class="arrow-right fr el-icon-arrow-down"></i>
        </div>
      </div>
      <div :class="{'plant-item':true, 'height-0':!collapse}">
        <div class="line-collapse">
          <span class="item">{{$t('plant.country')}}  : {{headInfo.country || '-'}}</span>
          <span class="item">{{$t('plant.city')}} : {{headInfo.city || '-'}}</span>
          <span class="item">{{$t('inverter.InvHV')}}  : {{headInfo.hardwareVersion || '-'}}</span>
          <span class="item">{{$t('inverter.InvMas')}} : {{headInfo.softVersion && headInfo.softVersion.master || '-'}}</span>
          <span class="item">{{$t('inverter.InvSla')}} : {{headInfo.softVersion && headInfo.softVersion.slave || '-'}}</span>
          <span class="item">{{$t('inverter.InvMan')}} : {{headInfo.softVersion && headInfo.softVersion.manager || '-'}}</span>
          <span class="item text-cut" :title="headInfo.feedinDate || '-'">{{$t('inverter.InsTime')}}  : {{headInfo.feedinDate || '-'}}</span>
        </div>
      </div>
    </div>
    <!-- 设备状态 电池状态 -->
    <div class="block status-box">
      <div class="left">
        <device-status
          :incomeDetail="incomeDetail"
          :power="incomeDetail.power"
          type="device"
          :capacity="incomeDetail.systemCapacity"
          :todayFault="todayFault"
          :id="deviceId"
          :title="$t('plant.equipSta')">
        </device-status>
      </div>
      <div class="right" v-if="flowType>1">
        <battery-status :batData="wsData.bat" :batteryInfo="batteryInfo"></battery-status>
      </div>
    </div>
    <!-- 今日异常 流向图 -->
    <div class="block">
      <el-row :gutter="12">
        <el-col :span="24">
          <el-card >
            <div class="title border-line" slot="header">
              <!-- Flow graph -->
              {{$t('inverter.powerFD')}}
              <i class="fr el-icon-more flow-icon-more" @click="flowDialog=true"></i>
            </div>
            <div class="flow-map flex-center">
              <flow-animate :flowType="flowType" :isElec="isElec" :path="flowPath" :wsData="wsData"></flow-animate>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 功率折线图和电量统计柱状图 -->
    <div class="mg-b12 show-shadow bg-c">
      <line-bar
        :id="deviceId"
        :type="'device'"
        :lineParams="lineParams"
        :barParams="barParams"
        ref="lineBar">
        <template v-slot:radioBtn>
          <el-radio-button label="power">{{$t('common.power')}}</el-radio-button>
          <el-radio-button label="elec">{{$t('common.gene')}}</el-radio-button>
        </template>
      </line-bar>
    </div>
    <!-- 多选折线图 -->
    <div class="bg-c show-shadow">
      <el-row class="select-line">
        <div class="flex-between">
          <div class="select-box">
            <el-select v-model="multiValue" collapse-tags multiple size="mini" :placeholder="$t('common.select')">
              <el-option
                v-for="item in options"
                :key="item.variable"
                :label="item.name"
                :value="item.variable">
              </el-option>
            </el-select>
            <el-button @click="selectChange" v-show="hasVarible" class="mg-l10" size="mini" plain>{{$t('common.search')}}</el-button>
          </div>
          <el-date-picker
            @change="selectChange"
            :clearable="false"
            size="mini"
            style="width:125px"
            :picker-options="pickerOptions"
            v-model="powerDate">
          </el-date-picker>
        </div>
      </el-row>
      <el-echart :loading="chartLoading" :datas="lineChart" height="350px"></el-echart>
    </div>
    <flow-dialog :visible.sync="flowDialog" :tabList="flowDetail"></flow-dialog>
  </section>
</template>
<script>
import deviceStatus from '@/views/pages/components/powerStatus'
import batteryStatus from './components/batteryStatus'
import lineBar from '@/views/pages/components/lineBar'
import flowDialog from './components/flowDialog'
import flowAnimate from './components/flowAnimate'
import lineChart from './mixins/lineChart'
import storage from '@/util/storage'
import { isJSON, formatDate, getTimespan } from '@/util'
export default {
  components: {
    deviceStatus,
    lineBar,
    batteryStatus,
    flowDialog,
    flowAnimate
  },
  mixins: [lineChart],
  data () {
    return {
      chartLoading: false,
      batteryInfo: {},
      flowPath: {},
      flowType: 1,
      isElec: false, // 是否有发电机
      powerDate: formatDate(Date.now(), 'yyyy-MM-dd'),
      flowDetail: [],
      lineParams: null,
      barParams: null,
      pvTotal: 0,
      wsData: {},
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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      incomeDetail: { // 收益详情
        currencyCount: 0, // 币种数量
        power: '', // 功率
        systemCapacity: '',
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
          token: storage.getStorage('token'),
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
    let { id, flowType, status } = this.$route.query
    this.deviceId = id
    this.flowType = Number(flowType)
    if (flowType > 1) { // 包含电池业务
      this.getBaterryInfo(id)
    }
    this.getHeadInfo()
    this.getOptions()
    this.getAbnormalStatus()
    this.getDeviceEarns()
    if (Number(status) !== 3) { // 设备状态为非离线状态 即正常建立websocket连接
      this.createWebsocket(this.getWsInfo)
    }
  },
  computed: {
    hasVarible () {
      return this.multiValue && this.multiValue.length > 0
    }
  },
  mounted () {
    if (this.flowType > 1) { // 电池业务
      this.lineParams = ['generationPower', 'feedinPower', 'batChargePower', 'batDischargePower']
      this.barParams = ['feedin', 'generation', 'gridConsumption', 'chargeEnergyToTal', 'dischargeEnergyToTal']
    }
    this.$refs.lineBar.getLineData('', this.lineParams)
    this.$refs.lineBar.getBarData('', this.barParams)
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
      let { result } = await this.$get({
        url: '/c/v0/device/addressbook',
        data: {
          deviceID: this.deviceId
        }
      })
      this.headInfo = result || {}
    },
    // 获取单个设备功率的发电和收益情况
    async getDeviceEarns () {
      let { result } = await this.$get({
        url: '/c/v0/device/earnings',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.incomeDetail.power = result.power
        this.incomeDetail.currencyCount = 0
        this.incomeDetail.systemCapacity = result.systemCapacity
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
      let { result } = await this.$get({
        url: '/c/v1/device/variables',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.options = result.variables || []
        // 设置初始值 // 输出功率
        let tempV = this.options.filter(v => v.variable === 'generationPower')
        if (tempV.length > 0) {
          this.multiValue = tempV.map(v => v.variable)
          this.selectChange()
        }
      }
    },
    // 多折线图表
    async getMultiChart () {
      this.chartLoading = true
      let { result } = await this.$post({
        url: '/c/v0/device/history/raw',
        isLoad: false,
        data: {
          deviceID: this.deviceId,
          variables: this.multiValue,
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
        let tempSeries = []
        let tempName = []
        result.forEach((v, i) => {
          let tempData = v.data.map(item => [getTimespan(item.time), this.toFixed(item.value), v.unit])
          tempSeries.push({
            symbol: 'none',
            name: v.name,
            data: tempData,
            unit: v.unit,
            type: 'line',
            markPoint: {
              data: [
                { type: 'max', name: '最大值', itemStyle: { color: 'green' } },
                { type: 'min', name: '最小值', itemStyle: { color: '#F96867' } }
              ]
            },
            smooth: true
          })
          tempName.push(v.name)
        })
        this.lineChart.series = tempSeries
        this.lineChart.legend.data = tempName
      }
      this.chartLoading = false
      return true
    },
    // 获取今日异常
    async getAbnormalStatus () {
      let { result } = await this.$get({
        url: '/c/v0/device/alarm/today',
        data: {
          deviceID: this.deviceId
        }
      })
      if (result) {
        this.todayFault = result.total || 0
      }
      return true
    },
    // 获取电池设备信息
    async getBaterryInfo (id) {
      let { result } = await this.$get({
        url: '/c/v0/device/battery/info',
        data: {
          id
        }
      })
      this.batteryInfo = result || {}
    },
    selectChange () {
      if (!this.hasVarible) return
      this.getMultiChart()
    },
    // 创建websocket
    createWebsocket (callback) {
      if (this.ws) return
      if (!window.WebSocket) {
        this.$message.error(`your brower can't support websocket, please go to update`)
        return
      }
      let socketUrl = `wss://${location.host}/c/v0/websocket`
      if (process.env.NODE_ENV === 'development') {
        socketUrl = process.env.VUE_APP_SOCKET
      }
      let ws = new WebSocket(socketUrl)
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
        let pvTotal = 0
        let { pvPower, generationPower, loadsPower, feedinPower, meterPower, invBatPower, gridConsumptionPower, meterPower2, meter2Status } = data
        if (pvPower && pvPower.length > 0) {
          // pvPower不可能为负值, 只需判断是否有>0的即可
          let flag = pvPower.some(v => v.value > 0)
          flag && (pvValue = 1)
          pvPower.forEach(v => {
            pvTotal += v.value
          })
        }
        this.isElec = meter2Status || false
        let tempObj = {
          pv: pvTotal || 0,
          load: loadsPower.value || 0,
          bat: invBatPower.value || 0,
          inverter: generationPower.value || 0,
          grid: meterPower.value || 0,
          elec: meterPower2.value || 0
        }
        if (this.flowType === 1) {
          let tempPower = gridConsumptionPower.value - feedinPower.value
          tempObj.grid = tempPower
          this.getFlowPathFor1(pvValue, generationPower.value, loadsPower.value, tempPower)
        } else if (this.flowType === 2) {
          this.getFlowPathFor2(pvValue, generationPower.value, invBatPower.value, meterPower.value, loadsPower.value, meterPower2.value)
        } else {
          this.getFlowPathFor3(generationPower.value, meterPower.value, invBatPower.value, loadsPower.value)
        }
        this.wsData = tempObj
      }
    },
    // 计算得出并网机流向图路径, 流动状态: 1向右 -1向左 2向上 -2向下 0 静止
    getFlowPathFor1 (pvValue, generationPower, loadsPower, tempP) {
      // tempP = gridConsumptionPower - feedinPower
      let tempObj = {
        box_pv_invert: 0,
        box_invert_node: 0,
        box_load_node: 0,
        box_grid_node: 0
      }
      if (pvValue > 0) {
        tempObj.box_pv_invert = 1
      }
      if (generationPower > 0) {
        tempObj.box_invert_node = 1
      }
      if (tempP > 0) {
        tempObj.box_grid_node = -1
      }
      if (tempP < 0) {
        tempObj.box_grid_node = 1
      }
      if (loadsPower > 0) {
        tempObj.box_load_node = -2
      }
      if (loadsPower < 0) {
        tempObj.box_load_node = 2
      }
      this.flowPath = tempObj
    },
    // 计算得出hybrid储能机流向图
    getFlowPathFor2 (pvPower, generationPower, invBatPower, meterPower, loadsPower, meterPower2) {
      let tempObj = {
        box_pv_invert: 0,
        box_bat_invert: 0,
        box_invert_node: 0,
        box_load_node: 0,
        box_grid_node: 0,
        box_node_little: 0,
        box_little_load: 0,
        box_little_elec: 0
      }
      if (pvPower > 0) {
        tempObj.box_pv_invert = 1
      }
      if (invBatPower > 0) {
        tempObj.box_bat_invert = 2
      }
      if (invBatPower < 0) {
        tempObj.box_bat_invert = -2
      }
      if (generationPower > 0) {
        tempObj.box_invert_node = 1
      }
      if (generationPower < 0) {
        tempObj.box_invert_node = -1
      }
      if (meterPower > 0) {
        tempObj.box_grid_node = -1
      }
      if (meterPower < 0) {
        tempObj.box_grid_node = 1
      }
      if (loadsPower > 0) {
        tempObj.box_load_node = -2
        tempObj.box_node_little = -2
      }
      if (loadsPower < 0) {
        tempObj.box_load_node = 2
        tempObj.box_node_little = 2
      }
      if ((loadsPower - meterPower2) > 0) {
        tempObj.box_little_load = 3 // nodeLittle流向负载
      }
      if (meterPower2 < 0) {
        tempObj.box_little_elec = 4 // 电表流向nodeLittle
      }
      this.flowPath = tempObj
    },
    // 计算得出ac单相储能机流向图
    getFlowPathFor3 (generationPower, meterPower, invBatPower, loadsPower) {
      let tempObj = {
        box_pv_invert: 0,
        box_invert_node: 0,
        box_load_node: 0,
        box_grid_node: 0
      }
      if (invBatPower > 0) {
        tempObj.box_pv_invert = 1
      }
      if (invBatPower < 0) {
        tempObj.box_pv_invert = -1
      }
      if (generationPower > 0) {
        tempObj.box_invert_node = 1
      }
      if (generationPower < 0) {
        tempObj.box_invert_node = -1
      }
      if (meterPower > 0) {
        tempObj.box_grid_node = -1
      }
      if (meterPower < 0) {
        tempObj.box_grid_node = 1
      }
      if (loadsPower > 0) {
        tempObj.box_load_node = -2
      }
      if (loadsPower < 0) {
        tempObj.box_load_node = 2
      }
      this.flowPath = tempObj
    }
  }
}
</script>
<style lang="less" scoped>
@import '../components/common/plantInvert';
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
