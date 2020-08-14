<template>
  <div class="status-box">
    <div class="left">
      <el-card shadow="never" class="card-no-padding">
        <div class="title border-line" slot="header">{{title}}</div>
        <el-row class="current-kw">
          <el-col :span="8">
            <div class="my-pg flex-center">
              <el-progress :width="150" type="circle" color="#67C23A" :show-text="false" :percentage="powerPercent" :stroke-width="12"></el-progress>
              <div class="progress-txt">
                <div class="number">{{toFixed(power) + 'kW'}}</div>
                <div class="f12">{{$t('common.currentP')}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <income-item v-bind="$attrs"></income-item>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- 储能电池状态 -->
    <div class="right" v-if="flowType>1 && batShow">
      <el-card shadow="never">
        <div class="title border-line" slot="header">{{$t('plant.baStatus')}}</div>
        <div class="battery-box">
          <div class="battery-img">
            <div class="header"></div>
            <div class="percent-bg" :style="{'width': (batteryInfo.soc  || 0) + '%'}">
              <div class="percent-bg-copy">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
              </div>
            </div>
          </div>
          <div class="item battery-value">{{(batteryInfo.soc || 0) + '%'}}</div>
          <div class="item battery-power">{{$t('common.power')}}: <span class="num">{{toFixed(batteryInfo.power) || 0}}</span>kW</div>
          <!-- $t('common.run')工作中 $t('common.sleep')休眠 -->
          <div class="item battery-status">{{$t('common.status')}}: <span class="status">{{translateStatus(batteryInfo.status, batteryInfo.power)}}</span></div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import incomeItem from './incomeItem'
export default {
  components: { incomeItem },
  data () {
    return {
      bPercent: 40,
      batteryInfo: {},
      flowType: 1
    }
  },
  props: {
    title: {
      default: ''
    },
    power: {
      default: 0
    },
    capacity: {
      default: 0
    },
    batShow: {
      default: true
    }
  },
  computed: {
    powerPercent () {
      if (this.power < 0) return 0
      if (this.capacity > 0) {
        let tempres = Math.ceil((this.power / this.capacity) * 100)
        if (tempres > 100) return 100
        return tempres
      }
      return 0
    }
  },
  created () {
    let { id, flowType } = this.$route.query
    if (flowType > 1) { // 包含电池业务
      this.flowType = flowType
      this.getBaterryInfo(id)
    }
  },
  methods: {
    // 获取电池设备信息
    async getBaterryInfo (id) {
      let { result } = await this.$axios({
        url: '/v0/device/battery/info',
        data: {
          id
        }
      })
      this.batteryInfo = result || {}
    },
    translateStatus (val, power) {
      //  -1离线 0休眠 1工作
      switch (val) {
        case 0:
          return this.$t('common.sleep')
        case 1:
          if (power > 0) {
            return this.$t('common.disCharge')
          } else {
            return this.$t('common.reCharge')
          }
        default:
          return this.$t('common.offline')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.status-box {
  display: flex;
  .right {
    margin-left: 10px;
    width: 230px;
    // height: 321px;
    // box-sizing: border-box;
    // padding: 10px;
  }
  .left {
    flex: 1;
  }
  .battery-box {
    height: 240px;
    .battery-img {
      position: relative;
      height: 80px;
      width: 180px;
      box-sizing: border-box;
      box-shadow: 0 0 5px 2px #ddd;
      border-radius: 5px 10px 10px 5px;
      .header {
        height: 25px;
        width: 10px;
        background-color: #ccc;
        position: absolute;
        top: 50%;
        right: -10px;
        transform: translate(0, -50%);
        border-radius: 0 5px 5px 0;
      }
      .percent-bg {
        position: relative;
        height: 100%;
        transition: all 1s;
        border-radius: 6px;
        background: linear-gradient(to right, #67C23A 0%, rgb(21, 226, 21) 100%);
        box-shadow: 0 14px 28px rgba(33, 150, 243, 0), 0 10px 10px rgba(9, 188, 215, 0.08);
        filter: hue-rotate(10deg);
      }
      .percent-bg-copy {
        border-radius: 6px;
        overflow: hidden;
        position: absolute;
        left: 0;
        right: 0;
        height: 100%;
        .wave {
          position: absolute;
          background: rgba(255, 255, 255, .8);
          border-radius: 45% 47% 44% 42%;
          height: 200px;
          width: 200px;
          right: -190px;
          top: 50%;
          transform: translate(0, -50%);
          z-index: 1;
          animation: wave 15s linear infinite;
          &:nth-child(2) {
            top: 40%;
            border-radius: 42% 46% 43% 47%;
            transform: translate(0, -50%) rotate(-135deg);
          }
          &:nth-child(3) {
            top: 60%;
            border-radius: 46% 46% 43% 40%;
            transform: translate(0, -50%) rotate(135deg);
          }
        }
      }
    }
    .item {
      padding: 15px 0;
    }
    .battery-value {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .battery-power,.battery-status {
      width: 100%;
      text-indent: 25px;
    }
    .battery-power {
      .num {
        color: #FDB201;
        margin: 0 5px 0 15px;
        font-size: 18px;
      }
    }
    .battery-status {
      .status {
        margin: 0 5px 0 15px;
      }
    }
  }
}
.my-pg {
  height: 240px;
  position: relative;
  overflow: hidden;
  border-right: 1px solid #f5f5f5;
  .el-progress {
    vertical-align: top
  }
  .progress-txt {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    color: #999;
    .number {
      color: #67C23A;
    }
  }
}
@keyframes wave {
  100% {
    transform: translate(0, -50%) rotate(720deg);
  }
}
</style>
