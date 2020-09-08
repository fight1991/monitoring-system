<template>
    <div class="flow-box" v-if="dot">
      <!-- 并网机动画 -->
      <div class="flex" v-if="flowType==1">
        <div class="circle-line box-left column-line">
          <div class="pv icon-pv">
            <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <!-- 从PV流向负载 -->
          <div class="dot1" v-show="path==2 || path==1 || path==5"></div>
          <!-- 从PV流向电网 -->
          <div class="dot3" v-show="path==2 || path==3"></div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="path==4 || path==5"></div>
          <div class="grid icon-grid">
            <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid) + ' kW'}}</span>
          </div>
          <div class="load icon-load">
            <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load) + ' kW'}}</span>
          </div>
        </div>
      </div>
      <!-- AC单相储能机动画 -->
      <div class="flex" v-if="flowType==3">
        <div class="circle-line box-left column-line">
          <div class="pv icon-battery">
            <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.pv) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <!-- 从电池流向负载 -->
          <div class="dot1" v-show="path==1 || path==3 || path==7"></div>
          <!-- 从电池流向电网 -->
          <div class="dot3" v-show="path==1 || path==2"></div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="path==4 || path==6 || path==7"></div>
          <!-- 从电网流向电池 -->
          <div class="dot4" v-show="path==5 || path==6"></div>
          <div class="grid icon-grid">
            <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid) + ' kW'}}</span>
          </div>
          <div class="load icon-load">
            <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load) + ' kW'}}</span>
          </div>
        </div>
      </div>
      <!-- hybrid储能机动画 -->
      <div class="flex hybrid" v-if="flowType==2">
        <div class="circle-line box-left column-line">
          <div class="pv icon-pv">
            <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <!-- 从pv流向电池 -->
          <div class="dot1" v-show="path==1 || path==11"></div>
          <div class="dot1_1" v-show="path==13"></div>
          <!-- 从PV流向电网 -->
          <div class="dot8" v-show="path==3 || path==2"></div>
          <!-- 从PV流向负载 -->
          <div class="dot9" v-show="path==4 || path==2"></div>
          <div class="dot9_1" v-show="path==14"></div>
          <!-- 从电池流向电网 -->
          <div class="dot5" v-show="path==5 || path==7"></div>
          <!-- 从电池流向负载 -->
          <div class="dot7" v-show="path==6 || path==7"></div>
          <div class="dot7_1" v-show="path==15"></div>
        </div>
        <div class="circle-line box-center column-line">
          <div class="load icon-battery">
            <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.bat) + ' kW'}}</span>
          </div>
        </div>
        <div class="circle-line box-right">
          <!-- 从电网流向负载 -->
          <div class="dot2" v-show="path==8 || path==9 || path==14 || path==15 || path==13"></div>
          <!-- 从电网流向电池 -->
          <div class="dot6" v-show="path==8 || path==10 || path==11"></div>
          <div class="grid icon-grid">
            <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid) + ' kW'}}</span>
          </div>
          <div class="load icon-load">
            <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load) + ' kW'}}</span>
          </div>
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
    wsData: {
      default: () => {}
    },
    flowType: {
      default: 1 // 1 并网机; 2 hybrid储能机; 3 AC单相储能机
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.column-line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 0;
  height: 150px;
  width: 1px;
  border-right: 1px solid #67C23A;
}
.flow-box {
  width: 95%;
  border-top: 1px solid #67C23A;
}
.box-right::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transform: translate3d(-50%, -50%, 0);
  height: 6px;
  width: 6px;
  border-radius: 50%;
  border: 1px solid #67C23A;
  background-color: #fff;
  box-shadow: 0px 0px 4px 1px #ccc;
  z-index: 10;
}
.circle-line {
  height: 150px;
  position: relative;
  &:first-child {
    width: 66.66%;
  }
  &:last-child {
    width: 33.33%;
  }
  .pv,
  .load,
  .grid,
  .inverter {
    position: absolute;
    width: 85px;
    height: 85px;
    background-image: url('../../../../assets/sprite/sprite.png');
    // transform: translate(-50%,-50%) scale(.6);
    z-index: 99;
    background-color: #fff;
  }
  .pv {
    top: 0;
    left: 0;
    transform: translate3d(-10px,-50%, 0);
  }
  .inverter {
    top: 0;
    right: 50px;
    transform: translate3d(0, -50%, 0)
  }
  .grid {
    top: 0;
    right: 0;
    transform: translate3d(10px, -50%, 0)
  }
  .load {
    bottom: 0;
    left: 0;
    transform: translate3d(-50%, 50%, 0)
  }
  .data-text {
    background-color: #fff;
    position: absolute;
    bottom: -12px;
    left: 50%;
    color: green;
    font-size: 12px;
    width: 100%;
    text-align: center;
    transform: translate3d(-50%, 0, 0);
    animation: jump 2s linear infinite;
  }
  .dot1,.dot2,.dot3, .dot4, .dot5, .dot6, .dot7, .dot8, .dot9, .dot9_1, .dot7_1, .dot1_1{
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid greenyellow;
    background-color: #67C23A;
    box-shadow: 0px 0px 4px 1px #FDB201;
    z-index: 66;
  }
  .dot1,.dot3, .dot8, .dot9, .dot9_1, .dot1_1 {
    top: 0;
    left: 0;
    transform: translate3d(-50%,-50%, 0);
  }
  .dot2, .dot4, .dot6 {
    top: 0;
    right: 0;
    transform: translate3d(50%,-50%,0);
  }
  .dot5, .dot7, .dot7_1 {
    right: 0;
    bottom: 0;
    transform: translate3d(50%, 50%, 0);
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
  .dot7 {
    animation: dot7 2s linear infinite;
  }
  .dot8 {
    animation: dot8 2s linear infinite;
  }
  .dot9 {
    animation: dot9 2s linear infinite;
  }
  .dot9_1 {
    animation: dot9_1 2s linear infinite;
  }
  .dot7_1 {
    animation: dot7_1 2s linear infinite;
  }
  .dot1_1 {
    animation: dot1_1 2s linear infinite;
  }
}
.hybrid {
  .circle-line {
    width: 33.33%;
    .inverter {
      right: 0;
      transform: translate3d(50%, -50%, 0);
    }
  }
}
@keyframes dot1 {
  0% {
    top: 0;
    left: 0;
  }
  33% {
    top: 0;
    left: 100%;
  }
  66% {
    top: 0;
    left: 100%;
  }
  100% {
    top: 100%;
    left: 100%;
  }
}
@keyframes dot2 {
  0% {
    right: 0;
    top: 0;
  }
  33% {
    top: 0;
    right: 100%;
  }
  66% {
    top: 50%;
    right: 100%;
  }
  100% {
    top: 100%;
    right: 100%;
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
  33% {
    bottom: 100%;
    right: 0;
  }
  66% {
    right: -100%;
    bottom: 100%;
  }
  100% {
    right: -200%;
    bottom: 100%;
  }
}
@keyframes dot6 {
  0% {
    top: 0;
    right: 0;
  }
  33% {
    top: 0;
    right: 100%;
  }
  66% {
    top: 0;
    right: 200%;
  }
  100% {
    right: 200%;
    top: 100%;
  }
}
@keyframes dot7 {
  0% {
    right: 0;
    bottom: 0;
  }
  33% {
    bottom: 100%;
    right: 0;
  }
  66% {
    right: -100%;
    bottom: 100%;
  }
  100% {
    right: -100%;
    bottom: 0;
  }
}
@keyframes dot8 {
  0% {
    left: 0;
    top: 0;
  }
  50% {
    left: 200%;
    top: 0;
  }
  100% {
    left: 300%;
    top: 0;
  }
}
@keyframes dot9{
  0% {
    left: 0;
    top: 0;
  }
  50% {
    left: 200%;
    top: 0;
  }
  100% {
    left: 200%;
    top: 100%;
  }
}
@keyframes dot9_1{
  0% {
    top: 0;
    left: 0;
  }
  33% {
    top: 0;
    left: 200%;
  }
  66% {
    top: 50%;
    left: 200%;
  }
  100% {
    top: 100%;
    left: 200%;
  }
}
@keyframes dot7_1 {
  0% {
    right: 0;
    bottom: 0;
  }
  15% {
    right: 0;
    bottom: 100%;
  }
  33% {
    right: -100%;
    bottom: 100%;
  }
  66% {
    right: -100%;
    bottom: 50%;
  }
  100% {
    right: -100%;
    bottom: 0;
  }
}
@keyframes dot1_1 {
  0% {
    top: 0;
    left: 0;
  }
  33% {
    top: 0;
    left: 100%;
  }
  66% {
    top: 50%;
    left: 100%;
  }
  100% {
    top: 100%;
    left: 100%;
  }
}
@keyframes jump {
  0% {
    transform: translate3d(-50%, 5px, 0);
  }
  50% {
    transform: translate3d(-50%, 0px, 0);
  }
  100% {
    transform: translate3d(-50%, 5px, 0);
  }
}
</style>
