<template>
    <div class="flow-box" v-if="dot">
      <!-- 并网机动画 -->
      <div class="flex" v-if="type==0">
        <div class="circle-line box-left">
          <div class="pv icon-pv"></div>
          <div class="inverter icon-inverter"></div>
          <div class="pv-text">PV&nbsp;:&nbsp;{{pvValue}}</div>
          <!-- 从PV流向负载 -->
          <div class="dot1" v-show="path==2 || path==1"></div>
          <!-- 从PV流向电网 -->
          <div class="dot3" v-show="path==2 || path==3"></div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="path==4"></div>
          <div class="grid icon-grid"></div>
          <div class="load icon-load"></div>
        </div>
      </div>
      <!-- AC单相储能机动画 -->
      <div class="flex" v-if="type==1">
        <div class="circle-line box-left">
          <div class="pv icon-battery"></div>
          <div class="inverter icon-inverter"></div>
          <!-- 从电池流向负载 -->
          <div class="dot1" v-show="false"></div>
          <!-- 从电池流向电网 -->
          <div class="dot5" v-show="false"></div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="false"></div>
          <!-- 从电网流向电池 -->
          <div class="dot4" v-show="false"></div>
          <div class="grid icon-grid"></div>
          <div class="load icon-load"></div>
        </div>
      </div>
      <!-- hybrid储能机动画 -->
      <div class="flex hybrid" v-if="type==2">
        <div class="circle-line box-left">
          <div class="pv icon-pv"></div>
          <div class="inverter icon-inverter"></div>
          <!-- 从pv流向电池 -->
          <div class="dot1" v-show="false"></div>
          <!-- 从电池流向电网 -->
          <div class="dot5" v-show="false"></div>
        </div>
        <div class="circle-line box-center">
          <div class="load icon-battery"></div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="false"></div>
          <!-- 从电网流向电池 -->
          <div class="dot6" v-show="false"></div>
          <div class="grid icon-grid"></div>
          <div class="load icon-load"></div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      dot: true
    }
  },
  props: {
    path: {
      default: 0
    },
    pvValue: {
      default: 0
    },
    type: {
      default: 0 // 0 并网机; 1 AC单相储能机 2 hybrid储能机;
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.flow-box {
  width: 95%;
}
.circle-line {
  height: 150px;
  position: relative;
  &:first-child {
    border-top: 1px solid #67C23A;
    width: 66%;
  }
  &:last-child {
    width: 33%;
    border: 1px solid #67C23A;
    border-right: none;
    border-bottom: none;
  }
  .pv,
  .load,
  .grid,
  .inverter {
    position: absolute;
    width: 85px;
    height: 85px;
    background-image: url('../../../assets/sprite/sprite.png');
    // transform: translate(-50%,-50%) scale(.6);
    z-index: 99;
    background-color: #fff;
  }
  .pv {
    top: 0;
    left: 0;
    transform: translate(-10px,-50%);
  }
  .inverter {
    top: 0;
    right: 50px;
    transform: translate(0, -50%)
  }
  .grid {
    top: 0;
    right: 0;
    transform: translate(10px, -50%)
  }
  .load {
    bottom: 0;
    left: 0;
    transform: translate(-50%, 50%)
  }
  .pv-text {
    position: absolute;
    top: 50%;
    left: 0;
    color: #67C23A;
    font-size: 16px;
    width: 85px;
    text-align: center;
    transform: translateX(-10px)
  }
  .dot1,.dot2,.dot3, .dot4, .dot5, .dot6{
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid greenyellow;
    background-color: #67C23A;
    box-shadow: 0px 0px 4px 1px #FDB201;
    z-index: 66;
  }
  .dot1,.dot3 {
    top: 0;
    left: 0;
    transform: translate(-50%,-50%);
  }
  .dot2, .dot4, .dot6 {
    top: 0;
    right: 0;
    transform: translate(50%,-50%);
  }
  .dot5 {
    right: 0;
    bottom: 0;
    transform: translate(50%, 50%);
  }
  .dot1 {
    animation: dot1 2s linear infinite;
  }
  .dot2 {
    animation: dot2 2s linear infinite;
  }
  .dot3 {
    animation: dot3 2s linear infinite;
  }
  .dot4 {
    animation: dot4 2s linear infinite;
  }
  .dot5 {
    animation: dot5 2s linear infinite;
  }
  .dot6 {
    animation: dot6 2s linear infinite;
  }
}
.hybrid {
  .box-left {
    border-right: 1px solid #67C23A;
  }
  .box-center {
    border-top: 1px solid #67C23A;
  }
  .circle-line {
    width: 33.3%;
    .inverter {
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}
@keyframes dot1 {
  0% {
    left: 0;
    top: 0;
  }
  50% {
    top: 0;
    left: 100%;
  }
  100% {
    left: 100%;
    top: 100%;
  }
}
@keyframes dot2 {
  0% {
    right: 0;
    top: 0;
  }
  50% {
    top: 0;
    right: 100%;
  }
  100% {
    right: 100%;
    top: 100%;
  }
}
@keyframes dot4 {
  0% {
    right: 0;
    top: 0;
  }
  100% {
    right: 300%;
  }
}
@keyframes dot3 {
  0% {
    left: 0;
    top: 0;
  }
  50% {
    top: 0;
    left: 100%;
  }
  100% {
    left: 150%;
    top: 0;
  }
}
@keyframes dot5 {
  0% {
    right: 0;
    bottom: 0;
  }
  50% {
    bottom: 100%;
    right: 0;
  }
  100% {
    right: -200%;
    bottom: 100%;
  }
}
@keyframes dot6 {
  0% {
    right: 0;
    top: 0;
  }
  50% {
    top: 0;
    right: 200%;
  }
  100% {
    right: 200%;
    top: 100%;
  }
}
</style>
