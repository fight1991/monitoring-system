<template>
    <div class="flow-box" v-if="dot">
      <!-- 并网机动画 -->
      <div class="flex" v-if="flowType==1">
        <div class="circle-line box-left">
          <div class="pv icon-pv">
            <i class="iconfont icon-flow-pv"></i>
            <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv, true) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <i class="iconfont icon-flow-invert"></i>
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter, true) + ' kW'}}</span>
          </div>
          <!-- pv -- invert -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_pv_invert==1}"></div>
        </div>
        <div class="circle-line box-center">
          <!-- invert -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_invert_node==1}"></div>
          <!-- load -- node -->
          <div :class="{'flow-column': true, 'arrow-t':path.box_load_node==2, 'arrow-b':path.box_load_node==-2}"></div>
        </div>
        <div class="circle-line box-right">
          <!-- node -- grid -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_grid_node==1, 'arrow-l': path.box_grid_node==-1}"></div>
          <div class="grid icon-grid">
            <i class="iconfont icon-flow-grid"></i>
            <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid, true) + ' kW'}}</span>
          </div>
          <div class="load icon-load">
            <i class="iconfont icon-flow-load"></i>
            <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load, true) + ' kW'}}</span>
          </div>
        </div>
      </div>
      <!-- AC单相储能机动画 -->
      <div class="flex" v-if="flowType==3">
        <div class="circle-line box-left">
          <div class="pv icon-battery">
            <i class="iconfont icon-flow-battery"></i>
            <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.bat, true) + ' kW'}}</span>
          </div>
          <div class="inverter icon-inverter">
            <i class="iconfont icon-flow-invert"></i>
            <span class="data-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter, true) + ' kW'}}</span>
          </div>
          <!-- bat -- invert -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_pv_invert==1, 'arrow-l': path.box_pv_invert==-1}"></div>
        </div>
        <div class="circle-line box-center">
          <!-- invert -- node -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_invert_node==1, 'arrow-l': path.box_invert_node==-1}"></div>
          <!-- node -- load -->
          <div :class="{'flow-column': true, 'arrow-b': path.box_load_node==-2, 'arrow-t':path.box_load_node==2}"></div>
        </div>
        <div class="circle-line box-right">
          <!-- node -- grid -->
          <div :class="{'flow-row': true, 'arrow-r': path.box_grid_node==1, 'arrow-l': path.box_grid_node==-1}"></div>
          <div class="grid icon-grid">
            <i class="iconfont icon-flow-grid"></i>
            <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid, true) + ' kW'}}</span>
          </div>
          <div class="load icon-load">
            <i class="iconfont icon-flow-load"></i>
            <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load, true) + ' kW'}}</span>
          </div>
        </div>
      </div>
      <!-- hybrid储能机动画 -->
      <div :class="{'hybrid-box': isElec}" v-if="flowType==2">
        <div class="flex-end hybrid">
          <div class="circle-line box-left">
            <div class="pv icon-pv">
              <i class="iconfont icon-flow-pv"></i>
              <span class="data-text">PV&nbsp;:&nbsp;{{toFixed(wsData.pv, true) + ' kW'}}</span>
            </div>
            <div class="inverter icon-inverter">
              <i class="iconfont icon-flow-invert"></i>
              <span class="data-text inverter-text">Inverter&nbsp;:&nbsp;{{toFixed(wsData.inverter, true) + ' kW'}}</span>
            </div>
            <div class="battery icon-battery">
              <i class="iconfont icon-flow-battery"></i>
              <span class="data-text">Bat&nbsp;:&nbsp;{{toFixed(wsData.bat, true) + ' kW'}}</span>
            </div>
            <!-- pv -- inverter -->
            <div :class="{'flow-row': true, 'arrow-r': path.box_pv_invert==1}"></div>
            <!-- bat -- inverter -->
            <div :class="{'flow-column': true, 'self': true, 'arrow-t': path.box_bat_invert==2, 'arrow-b': path.box_bat_invert==-2}">
            </div>
          </div>
          <div class="circle-line box-center">
            <!-- invert -- node -->
            <div :class="{'flow-row': true, 'arrow-r': path.box_invert_node==1, 'arrow-l': path.box_invert_node==-1}"></div>
            <!-- load -- node -->
            <div :class="{'flow-column': true, 'arrow-b': path.box_load_node==-2, 'arrow-t': path.box_load_node==2}"></div>
            <!-- nodeLittle流向负载 little--load -->
            <div class="box-little left" v-if="isElec">
              <div :class="{'flow-row': true, 'arrow-l': path.box_little_load==3}"></div>
              <div :class="{'flow-column': true, 'arrow-b': path.box_little_load==3}"></div>
              <div class="load icon-load">
                <i class="iconfont icon-flow-load"></i>
                <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load, true) + ' kW'}}</span>
              </div>
            </div>
            <!-- 电表流向nodeLittle elec--little -->
            <div class="box-little right" v-if="isElec">
              <div :class="{'flow-row': true, 'arrow-l': path.box_little_elec==4}"></div>
              <div :class="{'flow-column': true, 'arrow-t': path.box_little_elec==4}"></div>
              <div class="elec">
                <i class="iconfont icon-flow-elec"></i>
                <span class="data-text elec-text">Generator&nbsp;:&nbsp;{{toFixed(wsData.elec, true) + ' kW'}}</span>
              </div>
            </div>
          </div>
          <div class="circle-line box-right">
            <!-- grid -- node -->
            <div :class="{'flow-row': true, 'arrow-r': path.box_grid_node==1, 'arrow-l': path.box_grid_node==-1}"></div>
            <div class="grid icon-grid">
              <i class="iconfont icon-flow-grid"></i>
              <span class="data-text">Grid&nbsp;:&nbsp;{{toFixed(wsData.grid, true) + ' kW'}}</span>
            </div>
            <div class="load icon-load" v-show="!isElec">
              <i class="iconfont icon-flow-load"></i>
              <span class="data-text">Load&nbsp;:&nbsp;{{toFixed(wsData.load, true) + ' kW'}}</span>
            </div>
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
    isElec: { // 发电机图标是否显示
      default: false
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
  width: 90%;
  // border-top: 1px solid #67C23A;
  margin: 60px 50px;
}
.box-right::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  transform: translate3d(-50%, -50%, 0);
  height: 14px;
  width: 14px;
  border-radius: 50%;
  border: 1px solid #67C23A;
  background: radial-gradient(#fff, green);
  box-shadow: 0px 0px 4px 1px purple;
  z-index: 10;
}
.hybrid {
  .circle-line {
    .battery {
      right: 0;
      bottom: 0;
      transform: translate(50%, 50%);
      background: radial-gradient(white 0%,white 40%, green);
      color: green;
    }
  }
  .flow-column.self {
    right: -3px;
  }
  .box-center {
    .box-little {
      position: absolute;
      background-color: #fff;
      right: 0;
      bottom: 0;
      width: 50%;
      height: 50%;
      &::after {
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        background: radial-gradient(#fff, rgb(55, 214, 55));
        box-shadow: 0px 0px 4px 1px ccc;
      }
      // .flow-row {
      //   top: 0;
      // }
      &.left {
        .flow-column {
          right: auto;
          left: -3px;
        }
        &::before {
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          background: radial-gradient(#fff, rgb(55, 214, 55));
          box-shadow: 0px 0px 4px 1px #ccc;
          z-index: 33;
        }
      }
      &.right {
        transform: translate(100%);
        &::after {
          left: auto;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
    }
  }
}
.circle-line {
  width: 33.3%;
  height: 150px;
  position: relative;
  // &:first-child {
  //   width: 40%;
  // }
  .elec,
  .pv,
  .load,
  .grid,
  .battery,
  .inverter {
    position: absolute;
    box-shadow: 0 0 10px rgba(0, 0, 0, .6);
    border-radius: 50%;
    width: 70px;
    height: 70px;
    text-align: center;
    // background-image: url('../../../../assets/sprite/sprite.png');
    // transform: translate(-50%,-50%) scale(.6);
    z-index: 99;
    background-color: #fff;
    .iconfont {
      line-height: 70px;
      font-size: 28px;
    }
  }
  .elec {
    bottom: 0;
    right: 0;
    transform: translate3d(50%,50%, 0);
    background: radial-gradient(white 0%,white 40%, #4EC6FF);
    color: #4EC6FF;
  }
  .pv {
    top: 0;
    left: 0;
    transform: translate3d(-50%,-50%, 0);
    background: radial-gradient(white 0%,white 40%, #F8E71C);
    color: #F8E71C;
  }
  .inverter {
    top: 0;
    right: 0;
    transform: translate3d(50%, -50%, 0);
    background: radial-gradient(white 0%,white 40%, #7ED321);
    color: #7ED321;
  }
  .grid {
    top: 0;
    right: 0;
    transform: translate3d(50%, -50%, 0);
    background: radial-gradient(white 0%,white 40%, #F039F0);
    color: #F039F0;
  }
  .load {
    bottom: 0;
    left: 0;
    transform: translate3d(-50%, 50%, 0);
    background: radial-gradient(white 0%,white 40%, #4EC6FF);
    color: #4EC6FF;
  }
  .data-text {
    background-color: #fff;
    position: absolute;
    bottom: -22px;
    left: 50%;
    // color: #ccc;
    font-size: 12px;
    white-space:nowrap;
    text-align: center;
    transform: translate3d(-50%, 0, 0);
    // animation: jump 5s linear infinite;
  }
  .inverter-text {
    bottom: 86px;
  }
}
// .circle-line.elec-machine {
//   width: 3%;
// }
.hybrid-box {
  .circle-line {
    &:nth-child(1) {
      width: 30%;
    }
    &:nth-child(2) {
      width: 35%;
    }
    &:nth-child(3) {
      width: 35%;
    }
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
    box-sizing: border-box;
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
.elec-flow {
  top: 0;
  right: 100%;
  transform: translate(3px);
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
    background-position: 0;
  }
  100% {
    background-position: 100px 0;
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
