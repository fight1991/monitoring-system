<template>
  <section class="sys-main">
    <!-- 电站名称区域 -->
    <div class="block show-shadow bg-c mg-b12">
      <div class="plant-head flex-between">
        <div class="plant-box flex-vertical-center">
          <div class="plant-name flex-center">
            <i class="iconfont icon-fadianzhan"></i>
            <div v-if="pageFlag==='detail'">
              <span>{{$t('plant.name')}} : {{plantHeadInfo.plantName}}</span>
              <span>{{$t('plant.country')}} : {{plantHeadInfo.country}}</span>
              <span>{{$t('plant.city')}} : {{plantHeadInfo.city}}</span>
            </div>
            <div v-else>
              <span>{{$t('common.plantsName')}} </span>
            </div>
            <div class="select-area flex-center" v-if="pageFlag==='board'">
              <i class="arrow el-icon-caret-left" v-if="switchBtnShow && plantIndex > 0" @click="switchPlant('reduce')"></i>
              <!-- 电站名称切换 -->
              <el-select size="mini" @change="getCommonRequest" v-model="plantId" :placeholder="$t('common.select')">
                <el-option v-for="item in plantList" :label="item.plantName" :value="item.stationID" :key="item.stationID"></el-option>
              </el-select>
              <i class="arrow el-icon-caret-right" v-if="switchBtnShow && plantIndex < plantList.length -1" @click="switchPlant('add')"></i>
            </div>
          </div>
          <div class="plant-link" v-if="access==1" @click="golinkSn">
            <el-button size="mini" icon="el-icon-link">{{$t('navBar.linkSn')}}</el-button>
          </div>
        </div>
        <div class="right-box flex-vertical-center">
          <!-- <div class="weather flex-vertical-center">
            <div class="weather-img"><i class="iconfont icon-qing" style="font-size:30px"></i></div>
            <div class="weather-text">{{$t('common.sunny')}}</div>
            <div class="weather-temper">27℃</div>
            <div class="weather-place flex-center"><i class="iconfont icon-dizhi"></i>&nbsp;{{$t('common.wuxi')}}</div>
          </div> -->
          <div class="pull-icon">
            <i @click="headCollapse" v-show="!collapse" class="arrow-right fr el-icon-arrow-right"></i>
            <i @click="headCollapse" v-show="collapse" class="arrow-right fr el-icon-arrow-down"></i>
          </div>
        </div>
      </div>
      <div :class="{'plant-item':true, 'height-0':!collapse}">
        <div class="line-collapse">
          <span class="item" v-if="pageFlag==='board'">{{$t('plant.country')}} : {{plants.country || '-'}}</span>
          <span class="item" v-if="pageFlag==='board'">{{$t('plant.city')}} : {{plants.city || '-'}}</span>
          <span class="item">{{$t('join.installer')}}  : {{installer.account || '-'}}</span>
          <span class="item">{{$t('common.contact')}}  : {{installer.phone || '-'}}</span>
          <span class="item">{{$t('plant.user')}} : {{users.account || '-'}}</span>
          <span class="item">{{$t('common.userContact')}}  : {{users.phone || '-'}}</span>
          <span class="item">{{$t('plant.type')}} : {{plants.plantType === 1 ? $t('common.light') : plants.plantType === 2 ? $t('common.energy'): '-'}}</span>
          <span class="item text-cut" :title="plants.createdDate || '-'">{{$t('plant.websiteTime')}} : {{plants.createdDate || '-'}}</span>
          <span class="item text-cut" :title="plants.address || '-'">{{$t('plant.websiteAddr')}} : {{plants.address || '-'}}</span>
        </div>
      </div>
    </div>
    <!-- 电站状态 设备状态-->
    <div class="block status-box">
      <div class="left">
        <plant-status
          :incomeDetail="incomeDetail"
          :power="incomeDetail.power"
          type="plant"
          :capacity="incomeDetail.systemCapacity"
          :todayFault="todayFault"
          :id="plantId"
          :title="$t('plant.plantS')">
        </plant-status>
      </div>
      <div class="right" v-if="access!=1">
        <el-card>
          <div class="title border-line" slot="header">{{$t('plant.equipSta')}}</div>
          <div class="progress-container">
            <div class="progress-line">
              <div class="status-text f12 flex-between"><span>{{$t('common.total')}}</span><span style="color:#00BFFF">{{device.total}}</span></div>
              <el-progress class="progress" :show-text="false" :stroke-width="10" :percentage="percentMethod(device.total)" color="#00BFFF"></el-progress>
            </div>
            <div class="progress-line">
              <div class="status-text f12 flex-between"><span>{{$t('common.normal')}}</span><span style="color:#67c23a">{{device.normal}}</span></div>
              <el-progress class="progress" :show-text="false" :stroke-width="10" :percentage="percentMethod(device.normal)" color="#67c23a"></el-progress>
            </div>
            <div class="progress-line">
              <div class="status-text f12 flex-between"><span>{{$t('common.glitch')}}</span><span style="color:#f56c6c">{{device.fault}}</span></div>
              <el-progress class="progress" :show-text="false" :text-inside="true" :stroke-width="10" :percentage="percentMethod(device.fault)" color="#f56c6c"></el-progress>
            </div>
            <div class="progress-line">
              <div class="status-text f12 flex-between"><span>{{$t('common.offline')}}</span><span style="color:#909399">{{device.offline}}</span></div>
              <el-progress class="progress" :show-text="false" :text-inside="true" :stroke-width="10" :percentage="percentMethod(device.offline)" color="#909399"></el-progress>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 功率 统计 设备列表 -->
    <div class="block show-shadow">
      <line-bar :id="plantId" :type="'plant'" ref="lineBar">
        <template v-slot:radioBtn>
          <el-radio-button label="power">{{$t('common.power')}}</el-radio-button>
          <el-radio-button label="elec">{{$t('common.gene')}}</el-radio-button>
          <el-radio-button label="list">{{$t('plant.deviceL')}}</el-radio-button>
        </template>
        <template v-slot:other>
          <device-list ref="deviceList" :id="plantId"></device-list>
        </template>
      </line-bar>
    </div>
  </section>
</template>
<script>
import plantStatus from '@/views/pages/components/powerStatus'
import lineBar from '@/views/pages/components/lineBar'
import deviceList from './deviceList'
import { decodeData } from '@/util'
export default {
  components: {
    deviceList,
    plantStatus,
    lineBar
  },
  data () {
    return {
      pageFlag: 'detail',
      switch: false, // 节流
      collapse: false,
      abnormalVisible: false,
      plantId: '',
      plantList: [],
      plantHeadInfo: {
        plantName: '',
        country: '',
        city: ''
      },
      plants: {},
      installer: {},
      users: {},
      todayFault: 0,
      device: {
        total: 0,
        normal: 0,
        warning: 0,
        fault: 0,
        offline: 0
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
      }
    }
  },
  computed: {
    deviceTotal () {
      return this.device.total
    },
    plantIndex () {
      return this.plantList.findIndex(v => v.stationID === this.plantId)
    },
    switchBtnShow () {
      return this.plantList && this.plantList.length > 1
    }
  },
  created () {
    let { query: { plantId }, meta: { page } } = this.$route
    if (plantId) {
      this.plantId = plantId
    }
    this.pageFlag = page
  },
  async mounted () {
    if (this.pageFlag === 'detail') { // 电站详情页面
      this.plantHeadInfo = decodeData(this.$route.query.plantInfo)
      this.getCommonRequest()
    } else { // dashboard页面
      // 获取plantList列表
      await this.getPlantList()
      let tempId = (this.plantList[0] && this.plantList[0].stationID) || ''
      // 本地session无则取plantList第一项
      let sessionId = sessionStorage.getItem('plantId')
      if (sessionId) {
        let flag = this.plantList.some(v => v.stationID === sessionId)
        if (flag) {
          tempId = sessionStorage.getItem('plantId')
        }
      }
      this.plantId = tempId
      this.plantId && this.getCommonRequest()
    }
  },
  beforeDestroy () {},
  methods: {
    // 关联用户sndialog
    golinkSn () {
      this.$tab.append({
        name: 'bus-plant-linkSn'
      })
    },
    // 顶部展开
    headCollapse () {
      this.collapse = !this.collapse
      if (!this.collapse) return
      this.plantId && this.getHeadInfo()
    },
    // 百分比取整数
    percentMethod (value) {
      if (this.deviceTotal === 0) return 0
      return (value / this.deviceTotal) * 100
    },
    // 发送非socket相关请求
    getCommonRequest () {
      // 记录下拉数据, 防止刷新页面数据丢失
      sessionStorage.setItem('plantId', this.plantId)
      this.getAbnormalStatus()
      this.getDeviceStatus()
      this.getPlantEarns()
      this.collapse && this.getHeadInfo()
      this.$refs.deviceList.resetSearchForm(this.plantId)
      this.$refs.lineBar.getLineData(this.plantId)
      this.$refs.lineBar.getBarData(this.plantId)
    },
    // 获取头部电站展开详情
    async getHeadInfo () {
      let { result } = await this.$get({
        url: '/c/v0/plant/addressbook',
        data: {
          stationID: this.plantId
        }
      })
      if (result) {
        this.plants = result.plant || {}
        this.installer = result.installer || {}
        this.users = result.users || {}
      }
    },
    // 电站列表
    async getPlantList () {
      let { result } = await this.$get({
        url: '/c/v0/plant/droplist'
      })
      if (result) {
        this.plantList = result.plants || []
      }
      return true
    },
    // 左右切换电站
    async switchPlant (type) {
      if (this.switch || this.plantList.length <= 1) return
      this.switch = true
      // 获取当前索引
      let index = type === 'reduce' ? this.plantIndex - 1 : this.plantIndex + 1
      if (index < 0) {
        index = 0
        return
      }
      if (index > this.plantList.length - 1) {
        index = this.plantList.length - 1
        return
      }
      this.plantId = this.plantList[index].stationID
      // 发送请求
      await this.$all([
        this.getAbnormalStatus(),
        this.getDeviceStatus(),
        this.getPlantEarns(),
        this.$refs.deviceList.search(this.plantId),
        this.$refs.lineBar.getLineData(this.plantId),
        this.$refs.lineBar.getBarData(this.plantId)])
      this.switch = false
    },
    // 获取电站下的设备状态
    async getDeviceStatus () {
      let { result } = await this.$get({
        url: '/c/v0/plant/status/detail',
        data: {
          stationID: this.plantId
        }
      })
      if (result) {
        this.device = result
      }
      return true
    },
    // 获取今日异常
    async getAbnormalStatus () {
      let { result } = await this.$get({
        url: '/c/v0/plant/alarm/today',
        data: {
          stationID: this.plantId
        }
      })
      if (result) {
        this.todayFault = result.total || 0
      }
      return true
    },
    // 获取单个电站的发电和收益情况
    async getPlantEarns () {
      let { result } = await this.$get({
        url: '/c/v0/plant/earnings/detail',
        data: {
          stationID: this.plantId
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
      return true
    }
  }
}
</script>
<style lang="less" scoped>
@import '../components/common/plantInvert';
.progress-container {
  display: flex;
  width: 210px;
  height: 240px;
  flex-direction: column;
  justify-content: space-around;
}
.status-text {
  padding: 2px 5px;
}
.plant-name span {
  margin-right: 30px;
}
.weather {
  margin-right: 30px;
  .weather-text, .weather-place {
    color: #666;
    margin: 0 10px;
  }
  .weather-temper {
    font-size: 16px;
  }
  .weather-place i{
    color: #FFA28D;
    font-size: 16px;
  }
  .weather-img {
    color: #FDB201;
  }
}
</style>
