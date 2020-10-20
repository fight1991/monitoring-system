<template>
  <div class="income-details flex">
    <div class="content-item flex-around">
      <div class="icon-img hidden-md-and-down">
        <i class="icon icon-plant-day"></i>
      </div>
      <div class="detail-box">
        <div class="plant-money txt-c text-cut">
          {{toFixed(incomeDetail.generation.today)}}
        </div>
        <div class="plant-text text-cut">
          {{$t('plant.genTod')}}
        </div>
      </div>
    </div>
    <div class="content-item flex-around">
      <div class="icon-img hidden-md-and-down">
        <i class="icon icon-plant-month"></i>
      </div>
      <div class="detail-box">
        <div class="plant-money text-cut">
          {{toFixed(incomeDetail.generation.month)}}
        </div>
        <div class="plant-text text-cut">
          {{$t('plant.genMon')}}
        </div>
      </div>
    </div>
    <div class="content-item flex-around">
      <div class="icon-img hidden-md-and-down">
        <i class="icon icon-plant-total"></i>
      </div>
      <div class="detail-box">
        <div class="plant-money text-cut txt-c">
          {{toFixed(incomeDetail.generation.cumulate)}}
        </div>
        <div class="plant-text text-cut">
          {{$t('plant.genTot')}}
        </div>
      </div>
    </div>
    <div class="content-item flex-around" v-if="incomeDetail.currencyCount <= 1">
      <div class="icon-img hidden-md-and-down">
        <i class="icon icon-incomeT"></i>
      </div>
      <div class="detail-box">
        <div class="plant-money text-cut plant-money-green">
          {{incomeDetail.earnings.cumulate[0] && toFixed(incomeDetail.earnings.cumulate[0]['value'])}}
        </div>
        <div class="plant-text text-cut">
          {{$t('plant.earnTot')}} ({{incomeDetail.earnings.cumulate[0] && incomeDetail.earnings.cumulate[0]['currency']}})
        </div>
      </div>
    </div>
    <div class="content-item flex-around" v-else>
      <div class="icon-img hidden-md-and-down">
        <i class="icon icon-incomeT"></i>
      </div>
      <div class="detail-box">
        <div class="plant-money text-cut plant-money-green">
          <el-popover
            popper-class="money-popper"
            placement="right"
            :title="$t('common.list')"
            width="100"
            trigger="hover">
            <p v-for="item in incomeDetail.earnings.cumulate" :key="item.currency">
              {{item.currency + ' : ' + toFixed(item.value)}}
            </p>
            <i class="iconfont icon-look moneny-detail" slot="reference"></i>
          </el-popover>
        </div>
        <div class="plant-text text-cut">
          {{$t('plant.earnTot')}}
        </div>
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
  methods: {}
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
    .detail-box {
      flex: 1;
    }
    .icon-img {
      overflow: hidden;
      width: 30%;
      text-align: center;
      padding: 0 10px;
    }
    .plant-text, .plant-money {
      // width: 33%;
      padding: 5px;
      text-align: center;
    }
    .plant-money {
      color: #FFC245;
      font-size: 16px;
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
