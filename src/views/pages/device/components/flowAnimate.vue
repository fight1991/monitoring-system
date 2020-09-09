<template>
    <div class="flow-box" v-if="dot">
      <!-- 并网机动画 -->
      <div class="flex" v-if="flowType==1">
        <div class="circle-line box-left">
          <div class="pv icon-pv">
            <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <!-- pv -- invert -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_left_top==1}"></div>
        </div>
        <div class="circle-line box-center">
          <!-- invert -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_center_top==1}"></div>
          <!-- load -- node -->
          <div :class="{'flow-column': true, 'arrow-t':path.box_center_right==2}"></div>
        </div>
        <div class="circle-line box-right">
          <!-- node -- grid -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_right_top==1, 'arrow-l': path.box_right_top==-1}"></div>
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
        <div class="circle-line box-left">
          <div class="pv icon-battery">
            <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.bat) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <!-- bat -- invert -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_left_top==1, 'arrow-l': path.box_left_top==-1}"></div>
        </div>
        <div class="circle-line box-center">
          <!-- invert -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_center_top==1, 'arrow-l': path.box_center_top==-1}"></div>
          <!-- node -- load -->
          <div :class="{'flow-column': true, 'arrow-b': path.box_center_right==-2}"></div>
        </div>
        <div class="circle-line box-right">
          <!-- node -- grid -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_right_top==1, 'arrow-l': path.box_right_top==-1}"></div>
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
        <div class="circle-line box-left">
          <div class="pv icon-pv">
            <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter) + ' kW'}}</span>
          </div>
          <div class="battery icon-battery">
            <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.bat) + ' kW'}}</span>
          </div>
          <!-- pv -- inverter -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_left_top==1}"></div>
          <!-- bat -- inverter -->
          <div :class="{'flow-column': true, 'self': true, 'arrow-t': path.box_left_right==2, 'arrow-b': path.box_left_right==-2}">
          </div>
        </div>
        <div class="circle-line box-center">
          <!-- invert -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_center_top==1, 'arrow-l': path.box_center_top==-1}"></div>
          <!-- load -- node -->
          <div :class="{'flow-column': true, 'arrow-b':path.box_center_right==-2}"></div>
        </div>
        <div class="circle-line box-right">
          <!-- grid -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_right_top==1, 'arrow-l': path.box_right_top==-1}"></div>
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
      default: () => {}
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
  // border-top: 1px solid #67C23A;
}
.box-right::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transform: translate3d(-50%, -50%, 0);
  height: 8px;
  width: 8px;
  border-radius: 50%;
  border: 1px solid #67C23A;
  background-color: #fff;
  box-shadow: 0px 0px 4px 1px purple;
  z-index: 10;
}
.hybrid {
  .circle-line {
    .battery {
      right: -85px;
      bottom: 0;
      transform: translateY(50%);
    }
  }
  .flow-column.self {
    right: -45px;
  }
}
.circle-line {
  width: 33.33%;
  height: 150px;
  position: relative;
  .pv,
  .load,
  .grid,
  .battery,
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
    right: -85px;
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
    bottom: -14px;
    left: 50%;
    color: green;
    font-size: 12px;
    width: 120px;
    text-align: center;
    transform: translate3d(-50%, 0, 0);
    animation: jump 2s linear infinite;
  }
}
.flow-row,.flow-column {
  border-radius: 3px;
  overflow: hidden;
}
.flow-row {
  width: 100%;
  position: absolute;
  // padding: 1px;
  top: -3px;
  right: 0;
  box-shadow: 0px 0px 4px 1px #ccc;
  &::before, &::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
  }
  // .line_1, .line_2 {
  //   width: 100%;
  //   height: 3px;
  // }
  &.arrow-r {
    &::before {
      background-image: repeating-linear-gradient(45deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::after {
      background-image: repeating-linear-gradient(135deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::before, &::after {
      animation: flow_r 2s linear infinite;
    }
  }
  &.arrow-l {
    &::before {
      background-image: repeating-linear-gradient(135deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::after {
      background-image: repeating-linear-gradient(45deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::before, &::after {
      animation: flow_l 2s linear infinite;
    }
  }
}
.flow-column {
  height: 100%;
  display: flex;
  position: absolute;
  box-shadow: 0px 0px 4px 1px #ccc;
  top: 0;
  right: -3px;
  &::before, &::after {
    content: '';
    display: block;
    height: 100%;
    width: 3px;
  }
  // .line_1, .line_2 {
  //   height: 100%;
  //   width: 3px;
  // }
  &.arrow-t {
    &::before {
      background-image: repeating-linear-gradient(135deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::after {
      background-image: repeating-linear-gradient(-135deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::before, &::after {
      animation: flow_t 2s linear infinite;
    }
  }
  &.arrow-b {
    &::before {
      background-image: repeating-linear-gradient(45deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::after {
      background-image: repeating-linear-gradient(-45deg, white, white 5px, #67C23A 5px, #67C23A 7px);
    }
    &::before, &::after {
      animation: flow_b 2s linear infinite;
    }
  }
}
@keyframes flow_l {
  0% {
  }
  100% {
    background-position:-100px 0;
  }
}
@keyframes flow_r {
  0% {
  }
  100% {
    background-position:100px 0;
  }
}
@keyframes flow_t {
  0% {
  }
  100% {
    background-position: 0 -100px;
  }
}
@keyframes flow_b {
  0% {
  }
  100% {
    background-position: 0 100px;
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
