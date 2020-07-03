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
        <div class="title border-line" slot="header">{{$t('plant.baStatus')}}</div>
        <div class="battery-box">
          <div class="battery-img">
            <div class="percent-bg" :style="{'width': bPercent + '%'}"></div>
          </div>
          <div class="item battery-value">{{bPercent + '%'}}</div>
          <div class="item battery-power">{{$t('common.power')}}: <span class="num">10</span>W</div>
          <!-- $t('common.run')工作中 $t('common.sleep')休眠 -->
          <div class="item battery-status">{{$t('common.status')}}: <span class="status">{{$t('common.offline')}}</span></div>
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
      bPercent: 40
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
        let tempres = Math.ceil((this.power / this.capacity) * 100)
        if (tempres > 100) return 100
        return tempres
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
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: center;
    .battery-img {
      height: 80px;
      margin: 0 auto;
      // width: 100%;
      width: 180px;
      padding: 6px 18px 6px 6px;
      box-sizing: border-box;
      // border: 1px solid red;
      background: url("../../../assets/battery.png") no-repeat;
      background-size: 180px 100%;
      .percent-bg {
        background-color: #67C23A;
        height: 100%;
        transition: all 1s;
        border-radius: 6px;
        box-shadow: 0 0 2px #67C23A;
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
</style>
