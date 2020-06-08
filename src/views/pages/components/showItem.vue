<template>
  <div class="container-top mg-b10">
    <div class="left">
      <div class="top-item flex-between mg-b10">
        <div class="items flex-around" @click="selectStatus(0)">
          <i class="iconfont icon-sum"></i>
          <div class="items-right">
            <div>{{$t('common.total')}}</div>
            <div>
              <span class="num">{{plantStatus.total}}</span>
            </div>
          </div>
        </div>
        <div class="items flex-around" @click="selectStatus(1)">
          <i class="iconfont icon-normal"></i>
          <div class="items-right">
            <div>{{$t('common.normal')}}</div>
            <div>
              <span class="num">{{plantStatus.normal}}</span>
            </div>
          </div>
        </div>
        <div class="items flex-around" @click="selectStatus(2)">
          <i class="iconfont icon-fault"></i>
          <div class="items-right">
            <div>{{$t('common.abnormal')}}</div>
            <div>
              <span class="num">{{plantStatus.abnormal}}</span>
            </div>
          </div>
        </div>
        <div class="items flex-around" @click="selectStatus(3)">
          <i class="iconfont icon-offline"></i>
          <div class="items-right">
            <div>{{$t('common.offline')}}</div>
            <div>
              <span class="num">{{plantStatus.offline}}</span>
            </div>
          </div>
        </div>
      </div>
      <el-card shadow="never" class="no-bottom">
        <div class="title border-line" slot="header">{{$t('plant.statusGer')}}</div>
        <income-item :incomeDetail="incomeDetail"></income-item>
      </el-card>
    </div>
    <div class="right bg-c">
      <div class="weather-content flex-around">
        <div class="time-info">
          <div class="time">{{timeInfo.time}}</div>
          <div class="date">{{timeInfo.date}} {{timeInfo.week}}</div>
        </div>
        <div class="weather-info flex-center">
          <div class="weather-img"><i class="iconfont icon-qing" style="font-size:60px"></i></div>
          <div class="weather-text">22℃</div>
        </div>
      </div>
      <div class="map-content" style="width:100%;">
        <g-map v-if="lang=='en' && gMapNormal" @gMapError="gMapError"></g-map>
        <b-map v-else></b-map>
      </div>
    </div>
  </div>
</template>
<script>
import incomeItem from './incomeItem'
import { formatDate } from '@/util'
const bMap = () => import('./bMap')
const gMap = () => import('./gMap')
export default {
  name: 'show-item',
  components: {
    incomeItem,
    bMap,
    gMap
  },
  data () {
    return {
      gMapNormal: true,
      timer: null,
      plantStatus: {
        total: 0,
        normal: 0,
        abnormal: 0,
        offline: 0
      },
      timeInfo: {
        date: '00-00-00',
        time: '00:00:00',
        week: '--'
      },
      timeTrans: {
        zh: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        other: ['Monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      incomeList: [],
      mapId: '', // 地图容器 若id相同的话只渲染一次
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
      }
    }
  },
  computed: {
    lang () {
      return this.$store.state.lang
    }
  },
  created () {
    this.getTimeInfo()
    this.getPlantEarns()
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
    this.timer = null
  },
  mounted () {},
  methods: {
    // 谷歌地图切换错误(没翻墙),暂时切换百度地图
    gMapError () {
      this.gMapNormal = false
    },
    // 获取所有电站正常 非正常 故障个数
    async getPlantStatus () {
      let { result } = await this.$axios({
        url: '/v0/plant/status/all'
      })
      if (result) {
        this.plantStatus.total = result.total || 0
        this.plantStatus.normal = result.normal || 0
        this.plantStatus.abnormal = result.abnormal || 0
        this.plantStatus.offline = result.offline || 0
      }
    },
    selectStatus (status) {
      this.$emit('getselect', status)
    },
    // 获取时钟信息
    getTimeInfo () {
      this.timer = setInterval(() => {
        // 时:分:秒
        let tempS = new Date()
        let tempTime = formatDate(tempS, 'yyyy-MM-dd HH:mm:ss')
        let tempArr = tempTime.split(' ')
        this.timeInfo.date = tempArr[0]
        this.timeInfo.time = tempArr[1]
        let index = tempS.getDay() - 1
        this.timeInfo.week = this.lang === 'zh' ? this.timeTrans['zh'][index] : this.timeTrans['other'][index]
      }, 1000)
    },
    // 获取所有电站的发电和收益情况
    async getPlantEarns () {
      let { result } = await this.$axios({
        url: '/v0/plant/earnings/all'
      })
      if (result) {
        this.incomeDetail = result
      }
    }
  }
}
</script>
<style lang="less" scoped>
.map-content {
  width: 100%;
  height: calc(100% - 120px);
}
.container-top {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  .left {
    flex: 1;
    margin-right: 10px;
    .top-item {
      .items {
        cursor: pointer;
        padding: 10px 20px;
        background-color: #fff;
        box-sizing: border-box;
        width: 24%;
        &:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,.2);
          transition: all .5s ease-in-out;
        }
        .iconfont {
          font-size: 36px;
          color: #2AC6FC;
        }
        .icon-normal {
          color: #67C23A;
        }
        .icon-offline {
          color: #ccc;
        }
        .icon-fault {
          color: #FFC245;
        }
        .items-right {
          padding-left: 30px;
          text-align: right;
          .num {
            font-size: 16px;
            margin-right: 10px;
          }
          div {
            padding: 2px;
          }
        }
      }
    }
    .status-count {
      padding: 5px 0;
      .title {
        margin: 5px 10px;
        text-indent: 10px;
      }
      .content {
        border-top: 1px solid #f5f5f5;
        padding: 5px 10px;
        flex-wrap: wrap;
      }
      .content-item {
        padding: 10px 0;
        width: 50%;
        box-sizing: border-box;
        &:nth-child(2n+1) {
          border-right: 1px solid #f5f5f5;
        }
        .plant-money {
          .num {
            color: #FFC245;
            font-weight: bold;
          }
          .money {
            color: #67C23A;
            font-weight: bold;
          }
        }
      }
    }
  }
  .right {
    .weather-content {
      height: 95px;
      margin-bottom: 10px;
      text-align: center;
      .weather-img {
        padding: 5px 10px 5px;
        color: #FDB201;
      }
      .time-info {
        .time {
          font-size: 40px;
        }
        .date {
          padding-top: 5px;
          font-size: 14px;
        }
      }
    }
    width: 350px;
    padding: 5px;
    box-sizing: border-box;
  }
}
</style>
