<template>
  <el-card>
    <div class="title border-line" slot="header">{{$t('plant.baStatus')}}</div>
    <!-- 电池充电动画 -->
    <div class="g-container" v-show="isCharging">
      <div class="g-datas">
        <div class="g-percent">{{(batteryInfo.soc || 0) + '%'}}</div>
        <!-- <div class="g-power">{{toFixed(batteryInfo.power)}}</div> -->
        <div class="g-status">{{translateStatus(batteryInfo.status, batteryInfo.power) + ' ' + toFixed(batteryInfo.power, true) + 'kW'}}</div>
        <div class="g-status">{{$t('common.volt') + ' ' + toFixed(batteryInfo.volt) + 'V'}}</div>
      </div>
      <div class="g-contrast">
        <div class="g-circle"></div>
        <ul class="g-bubbles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
    <!-- 电池使用中和离线状态动画 -->
    <div class="battery-box" v-show="!isCharging">
      <div class="battery-img">
        <div class="header"></div>
        <div class="percent-bg" :style="{'width': (batteryInfo.soc  || 0) + '%'}">
          <div :class="{'percent-bg-copy': true, 'none': batteryInfo.soc==100}">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
          </div>
        </div>
      </div>
      <div class="item battery-value">{{(batteryInfo.soc || 0) + '%'}}</div>
      <div class="item battery-power" :title="Math.abs(batteryInfo.power) || ''">{{$t('common.power')}}: <span class="num">{{Math.abs(toFixed(batteryInfo.power)) || 0}}</span>kW</div>
      <div class="item battery-power">{{$t('common.volt')}}: <span class="num">{{toFixed(batteryInfo.volt) || 0}}</span>V</div>
      <!-- $t('common.run')工作中 $t('common.sleep')休眠 -->
      <div class="item battery-status">{{$t('common.status')}}: <span class="status">{{translateStatus(batteryInfo.status, batteryInfo.power)}}</span></div>
    </div>
  </el-card>
</template>

<script>
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    batteryInfo: {
      default: () => {
        return {}
      }
    },
    batData: { // 小于0充电, 大于0 放电
      default: 0
    }
  },
  created () {},
  mounted () {},
  computed: {
    isCharging () {
      let { status, power } = this.batteryInfo
      return (Number(status) === 1 && power < 0 || this.batData < 0)
    }
  },
  methods: {
    translateStatus (val, power) {
      //  -1离线 0休眠 1工作
      switch (val) {
        case 0:
          return this.$t('common.sleep')
        case 1: // power小于 0 充电
          if (power < 0 || this.batData < 0) { // 以流向图数据为准
            return this.$t('common.reCharge') // 充电
          } else {
            return this.$t('common.disCharge') // 使用中
          }
        default:
          return this.$t('common.offline')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.g-container,.battery-box {
  height: 240px;
  width: 210px;
}
.battery-box {
  .battery-img {
    position: relative;
    height: 90px;
    width: 200px;
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
        animation: wave 13s linear infinite;
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
    padding: 7px 0;
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
    &:hover {
      cursor: pointer;
    }
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
@keyframes wave {
  100% {
    transform: translate(0, -50%) rotate(720deg);
  }
}
.g-datas {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  // width: 300px;
  top: 72px;
  text-align: center;
  font-size: 12px;
  z-index: 10;
  color: #00ff6f;
  filter: contrast(15) hue-rotate(0);
  animation: hueRotate 10s infinite linear;
}
.g-percent {
  font-size: 22px;
}
.g-status {
  font-size: 12px;
}
.g-container {
  position: relative;
  margin: auto;
}
.g-contrast {
  filter: contrast(15) hue-rotate(0);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  animation: hueRotate 10s infinite linear;
}
.g-circle {
  position: relative;
  width: 210px;
  height: 144px;
  box-sizing: border-box;
  filter: blur(8px);
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0);
    width: 144px;
    height: 144px;
    background-color: #00ff6f;
    border-radius: 42% 38% 62% 49% / 45%;
    animation: rotate 10s infinite linear;
  }
  &::before {
    content: "";
    position: absolute;
    width: 120px;
    height: 120px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #fff;
    z-index: 10;
  }
}
.g-bubbles {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 80px;
  height: 20px;
  margin: 0;
  padding: 0;
  transform: translate(-50%, 0);
  border-radius: 20px 20px 0 0;
  background-color: #00ff6f;
  filter: blur(5px);
}
li {
  position: absolute;
  border-radius: 50%;
  background: #00ff6f;
  list-style: none;
}
@for $i from 1 through 10 {
  li:nth-child(#{$i}) {
    $width: 10 + random(10) + px;
    left: 10 + random(50) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop #{random(3) + 1}s ease-in-out -#{random(4000)/1000}s infinite;
  }
}
@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }
  100% {
    opacity: .1;
    transform: translate(-50%, -85px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
