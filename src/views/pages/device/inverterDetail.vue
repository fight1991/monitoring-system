<template>
  <section class="sys-main">
    <!-- 电站名称区域 -->
    <div class="block bg-c mg-b15">
      <div class="plant-head clearfix">
        <div class="plant-name flex-center">
          <i class="iconfont icon-nibianqi"></i>
          <div class="line-center">
            <div class="text-cut" :title="headInfo.deviceSN || ''">{{$t('common.invertSn')}} : {{headInfo.deviceSN || ''}}</div>
            <div class="text-cut" :title="headInfo.plantName || ''">{{$t('plant.name')}} : {{headInfo.plantName || ''}}</div>
            <div class="text-cut" :title="headInfo.moduleSN || ''">{{$t('common.datacolSN')}} : {{headInfo.moduleSN || ''}}</div>
            <div class="text-cut" :title="headInfo.deviceType || ''">{{$t('common.InvType')}} : {{headInfo.deviceType || ''}}</div>
            <div class="text-cut" :title="translateStatus(headInfo.status) || ''">{{$t('plant.equipSta')}} : {{translateStatus(headInfo.status) || ''}}</div>
          </div>
          <i @click="collapse=!collapse" v-show="!collapse" class="arrow-right fr el-icon-arrow-right"></i>
          <i @click="collapse=!collapse" v-show="collapse" class="arrow-right fr el-icon-arrow-down"></i>
        </div>
      </div>
      <div :class="{'plant-item':true, 'height-0':!collapse}">
        <div class="line-collapse">
          <span>{{$t('plant.country')}}  : {{headInfo.country || '-'}}</span>
          <span>{{$t('plant.city')}} : {{headInfo.city || '-'}}</span>
          <span>{{$t('inverter.InvHV')}}  : {{headInfo.hardwareVersion || '-'}}</span>
          <span>{{$t('inverter.InvMas')}} : {{headInfo.softVersion && headInfo.softVersion.master || '-'}}</span>
          <span>{{$t('inverter.InvSla')}} : {{headInfo.softVersion && headInfo.softVersion.slave || '-'}}</span>
          <span>{{$t('inverter.InvMan')}} : {{headInfo.softVersion && headInfo.softVersion.manager || '-'}}</span>
          <span class="text-cut" :title="headInfo.feedinDate || '-'">{{$t('inverter.InsTime')}}  : {{headInfo.feedinDate || '-'}}</span>
        </div>
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
              <flow-animate :flowType="flowType" :path="flowPath" :pvValue="pvTotal"></flow-animate>
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
        <div class="flex-between">
          <div class="select-box">
            <el-select v-model="multiValue" collapse-tags multiple size="mini" :placeholder="$t('common.select')">
              <el-option
                v-for="item in options"
                :key="item"
                :label="$t('chart.'+item)"
                :value="item">
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
      <el-echart :loading="chartLoading" :datas="lineChart" height="300px"></el-echart>
    </div>
    <flow-dialog :visible.sync="flowDialog" :tabList="flowDetail"></flow-dialog>
  </section>
</template>
<script>
import todayAbnormal from '@/views/pages/components/todayAbnormal'
import deviceStatus from '@/views/pages/components/powerStatus'
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
    todayAbnormal,
    flowDialog,
    flowAnimate
  },
  mixins: [lineChart],
  data () {
    return {
      chartLoading: false,
      flowPath: 0,
      flowType: 1,
      powerDate: formatDate(Date.now(), 'yyyy-MM-dd'),
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
    this.flowType = flowType
    this.getHeadInfo()
    this.getOptions()
    this.getAbnormalStatus()
    this.getDeviceEarns()
    if (status === 1) { // 设备状态为1 即正常建立websocket连接
      this.createWebsocket(this.getWsInfo)
    }
  },
  computed: {
    hasVarible () {
      return this.multiValue && this.multiValue.length > 0
    }
  },
  mounted () {
    let lineParams = null
    let barParams = null
    if (this.flowType !== 1) { // 电池业务
      lineParams = ['generationPower', 'feedinPower', 'batChargePower', 'batDischargePower']
      barParams = ['feedin', 'generation', 'gridConsumption', 'chargeEnergyToTal', 'dischargeEnergyToTal']
    }
    this.$refs.lineBar.getLineData('', lineParams)
    this.$refs.lineBar.getBarData('', barParams)
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
      this.chartLoading = true
      let { result } = await this.$axios({
        url: '/v0/device/history/raw',
        method: 'post',
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
        let temp = []
        result.forEach((v, i) => {
          let tempData = v.data.map(item => [getTimespan(item.time), this.toFixed(item.value), v.unit])
          temp.push({
            symbol: 'none',
            name: v.variable,
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
          this.lineChart.series = temp
        })
      }
      this.chartLoading = false
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
      if (!this.hasVarible) return
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
        let tempPath = 1000
        this.pvTotal = 0
        let { pvPower, generationPower, loadsPower, feedinPower, gridConsumptionPower, meterPower, invBatPower } = data
        if (pvPower && pvPower.length > 0) {
          // pvPower不可能为负值, 只需判断是否有>0的即可
          let flag = pvPower.some(v => v.value > 0)
          flag && (pvValue = 1)
          pvPower.forEach(v => {
            this.pvTotal += v.value
          })
        }
        if (this.flowType === 1) {
          tempPath = this.getFlowPathFor1(pvValue, generationPower.value, loadsPower.value, feedinPower.value, gridConsumptionPower.value)
        } else if (this.flowType === 2) {
          tempPath = this.getFlowPathFor2(pvValue, generationPower.value, feedinPower.value, invBatPower.value, meterPower.value)
        } else {
          tempPath = this.getFlowPathFor3(generationPower.value, meterPower.value, invBatPower.value)
        }
        this.flowPath = tempPath
      }
    },
    // 计算得出并网机流向图路径
    getFlowPathFor1 (pvValue, generationPower, loadsPower, feedinPower, gridConsumptionPower) {
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
    },
    // 计算得出hybrid储能机流向图
    getFlowPathFor2 (pvPower, generationPower, feedinPower, invBatPower, meterPower) {
      let flag0 = pvPower > 0 && invBatPower < 0
      let flag1 = invBatPower > 0 && generationPower > 0 && meterPower && (feedinPower / meterPower) < 0
      let flag2 = invBatPower > 0 && generationPower > 0 && (generationPower + meterPower) > 0
      let flag3 = meterPower && (feedinPower / meterPower) > 0 && generationPower < 0 && invBatPower < 0
      let flag4 = meterPower && (feedinPower / meterPower) > 0 && (generationPower + meterPower) > 0
      if (flag0) {
        return 1 // dot1显示
      } else if (flag1) {
        return 2 // dot5显示
      } else if (flag2) {
        return 3 // dot7显示
      } else if (flag3) {
        return 4 // dot6显示
      } else if (flag4) {
        return 5 // dot2 显示
      } else {
        return 0
      }
    },
    // 计算得出ac单相储能机流向图
    getFlowPathFor3 (generationPower, meterPower, invBatPower) {
      let flag1 = invBatPower > 0 && generationPower > 0
      if (flag1 && meterPower < 0) {
        if ((generationPower + meterPower) > 0) {
          return 1 // dot1和dot3同时显示
        } else {
          return 2 // 只有dot3显示
        }
      } else if (flag1 && meterPower >= 0) {
        return 3 // dot1显示
      } else if (meterPower > 0 && (generationPower + meterPower) > 0) {
        return 4 // dot2显示
      } else if (meterPower > 0 && generationPower < 0 && invBatPower < 0) {
        return 5 // dot4显示
      } else {
        return 0
      }
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
.line-center {
  flex: 1;
}
</style>
