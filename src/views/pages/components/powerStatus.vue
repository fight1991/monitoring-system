<template>
  <div>
    <el-card>
      <div class="title border-line" slot="header">
        {{title}}
        <span class="fr header-right" @click="visible=true" :title="$t('plant.todayAb')">
          <i class="iconfont icon-alarm-total"></i>
          <span class="fault-num">{{todayFault}}</span>
        </span>
      </div>
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
    <today-abnormal :visible.sync="visible" v-bind="$attrs"></today-abnormal>
  </div>
</template>
<script>
import incomeItem from './incomeItem'
import todayAbnormal from './todayAbnormal'
export default {
  components: { incomeItem, todayAbnormal },
  data () {
    return {
      bPercent: 40,
      visible: false
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
    todayFault: {
      default: 0
    }
  },
  computed: {
    powerPercent () {
      if (this.capacity > 0) {
        let tempres = Math.ceil((Math.abs(this.power) / this.capacity) * 100)
        if (tempres > 100) return 100
        return tempres
      }
      return 0
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.none {
  display: none;
}
.header-right {
  cursor: pointer;
  .fault-num {
    font-size: 16px;
    margin-left: 10px;
    color: #F96867;
  }
  .icon-alarm-total {
    color: #F96867;
    font-size: 18px;
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
