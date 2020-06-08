<template>
  <div class="income-details flex">
    <div class="content-item flex-around">
      <div class="icon-img">
        <i class="icon icon-plant-day hidden-sm-and-down"></i>
      </div>
      <div class="plant-text text-cut">
        {{$t('plant.genTod')}} (kwh)
      </div>
      <div class="plant-money text-cut txt-c">
        {{dataFormate(incomeDetail.generation.today)}}
      </div>
    </div>
    <div class="content-item flex-around">
      <div class="icon-img">
        <i class="icon icon-plant-month hidden-sm-and-down"></i>
      </div>
      <div class="plant-text text-cut">
        {{$t('plant.genMon')}} (kwh)
      </div>
      <div class="plant-money text-cut">
        {{dataFormate(incomeDetail.generation.month)}}
      </div>
    </div>
    <div class="content-item flex-around">
      <div class="icon-img">
        <i class="icon icon-plant-total hidden-sm-and-down"></i>
      </div>
      <div class="plant-text text-cut">
        {{$t('plant.genTot')}} (kwh)
      </div>
      <div class="plant-money text-cut txt-c">
        {{dataFormate(incomeDetail.generation.cumulate)}}
      </div>
    </div>
    <div class="content-item flex-around" v-if="incomeDetail.currencyCount <= 1">
      <div class="icon-img">
        <i class="icon icon-incomeT hidden-sm-and-down"></i>
      </div>
      <div class="plant-text text-cut">
        {{$t('plant.earnTot')}} ({{incomeDetail.earnings.cumulate[0] && incomeDetail.earnings.cumulate[0]['currency']}})
      </div>
      <div class="plant-money text-cut plant-money-green">
        {{incomeDetail.earnings.cumulate[0] && dataFormate(incomeDetail.earnings.cumulate[0]['value'])}}
      </div>
    </div>
    <div class="content-item flex-around" v-else>
      <div class="icon-img">
        <i class="icon icon-incomeT hidden-sm-and-down"></i>
      </div>
      <div class="plant-text text-cut">
        {{$t('plant.earnTot')}}
      </div>
      <div class="plant-money text-cut plant-money-green">
        <el-popover
          popper-class="money-popper"
          placement="right"
          title="List"
          width="100"
          trigger="hover">
          <p v-for="item in incomeDetail.earnings.cumulate" :key="item.currency">
            {{item.currency + ' : ' + dataFormate(item.value)}}
          </p>
          <i class="iconfont icon-look moneny-detail" slot="reference"></i>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    incomeDetail: {
      default () {
        return {
          currencyCount: 0, // 币种数量
          power: '', // 功率
          generation: {
            today: 0,
            month: 0,
            year: 0,
            cumulate: 0
          },
          earnings: {
            cumulate: [
              {
                currency: '-',
                value: 0
              }
            ]
          }
        }
      }
    }
  },
  methods: {
    dataFormate (num) { // 数据格式化
      return (num).toLocaleString()
    }
  }
}
</script>
<style lang="less" scoped>
.income-details {
  height: 240px;
  flex-wrap: wrap;
  .content-item {
    padding: 10px 0;
    width: 50%;
    box-sizing: border-box;
    &:nth-child(2n+1) {
      border-right: 1px solid #f5f5f5;
    }
    .icon-img {
      overflow: hidden;
    }
    .icon-img, .plant-text, .plant-money {
      width: 33%;
      text-align: center;
    }
    .plant-money {
      color: #FFC245;
      font-weight: bold;
    }
    .txt-c {
      text-align: center;
    }
    .plant-money-green {
      color: #67C23A;
      font-weight: bold;
    }
  }
  .moneny-detail {
    cursor: pointer;
    font-size: 26px;
  }
}
</style>
