<template>
  <div class="whether">
    <div class="left">
      <el-card shadow="never">
        <div class="title border-line" slot="header">{{title}}</div>
        <el-row class="current-kw">
          <el-col :span="8">
            <div class="my-pg flex-center">
              <el-progress :width="150" type="circle" color="#67C23A" :show-text="false" :percentage="powerPercent" :stroke-width="12"></el-progress>
              <div class="progress-txt">
                <div class="number">{{(power).toLocaleString() + 'kw'}}</div>
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
    <div class="right bg-c hidden-sm-and-down">
      <div class="weather-img"><i class="iconfont icon-qing" style="font-size:80px"></i></div>
      <div class="weather-text">晴天</div>
      <div class="weather-temper">27℃</div>
      <div class="weather-place flex-center"><i class="iconfont icon-dizhi"></i>&nbsp;江苏无锡</div>
    </div>
  </div>
</template>
<script>
import incomeItem from './incomeItem'
export default {
  components: { incomeItem },
  data () {
    return {}
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
.whether {
  display: flex;
  .right {
    margin-left: 10px;
    width: 250px;
    height: 321px;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .weather-text, .weather-place {
      color: #666;
    }
    .weather-temper {
      font-size: 24px;
    }
    .weather-place i{
      color: #FFA28D;
      font-size: 24px;
    }
    .weather-img {
      color: #FDB201;
    }
  }
  .left {
    flex: 1;
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
