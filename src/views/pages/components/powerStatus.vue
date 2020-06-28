<template>
  <div class="status-box">
    <div class="left">
      <el-card shadow="never">
        <div class="title border-line" slot="header">{{title}}</div>
        <el-row class="current-kw">
          <el-col :span="8">
            <div class="my-pg flex-center">
              <el-progress :width="150" type="circle" color="#67C23A" :show-text="false" :percentage="powerPercent" :stroke-width="12"></el-progress>
              <div class="progress-txt">
                <div class="number">{{toFixed(power) + 'kw'}}</div>
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
    <div class="right">
      <el-card shadow="never">
        <div class="title border-line" slot="header">电池状态</div>
        <div class="battery-box">
          <div class="battery-img">
            <div class="percent-bg" :style="{'width': 30 + '%'}"></div>
          </div>
          <div class="item battery-value">50%</div>
          <div class="item battery-power">功率: <span class="num">10</span>W</div>
          <div class="item battery-status">状态: <span class="status">离线</span></div>
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
      batteryPercent: 30
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
    }
  },
  computed: {
    powerPercent () {
      if (this.capacity > 0) {
        return Math.ceil((this.power / this.capacity) * 100)
      }
      return 0
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.status-box {
  display: flex;
  .right {
    margin-left: 10px;
    width: 250px;
    // height: 321px;
    // box-sizing: border-box;
    // padding: 10px;
  }
  .left {
    flex: 1;
  }
  .battery-box {
    height: 240px;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    .battery-img {
      height: 96px;
      margin: 0 auto;
      // width: 100%;
      width: 180px;
      padding: 6px 18px 6px 6px;
      box-sizing: border-box;
      // border: 1px solid red;
      background: url("../../../assets/battery.png") no-repeat;
      background-size: 180px 96px;
      .percent-bg {
        background-color: #67C23A;
        height: 100%;
        border-radius: 6px;
        box-shadow: 0 0 2px #67C23A;
      }
    }
    .item {
      padding: 10px 0;
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
  margin-right: 15px;
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
</style>
