<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('inverter.liveData')"
    :modal-append-to-body="false"
    @opened="search"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="700px">
    <div class="no-data" v-if="tabList.length<1">No Data</div>
    <el-tabs v-model="activeName" type="card" v-else>
      <el-tab-pane
        :label="item.blockName"
        :name="'tab' + index"
        v-for="(item, index) in tabList"
        :key="item.blockName">
        <div class="block-item" v-setH:max="setDivH - 100">
          <el-row class="block-head">
            <el-col :span="12">Variable</el-col>
            <el-col :span="12">Value</el-col>
          </el-row>
          <el-row v-for="item2 in item.values" :key="item2.variable">
            <el-col :span="12">{{item2.variable}}</el-col>
            <el-col :span="12">{{item2.value}}</el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'tab0',
      dialogVisible: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      alarmTypeList: [
        {
          value: 0,
          label: 'all'
        }, {
          value: 1,
          label: 'common'
        }, {
          value: 2,
          label: 'pvBus'
        }, {
          value: 3,
          label: 'powerGrid'
        }, {
          value: 4,
          label: 'temper'
        }, {
          value: 5,
          label: 'cpu'
        }, {
          value: 6,
          label: 'eps'
        }, {
          value: 7,
          label: 'peri'
        }, {
          value: 8,
          label: 'alarm'
        }
      ]
    }
  },
  props: {
    visible: {
      default: false
    },
    tabList: {
      default () {
        return []
      }
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    search () {
      this.getList(this.$store.state.pagination)
    },
    async getList (pagination) {}
  }
}
</script>
<style lang="less" scoped>
.block-item {
  overflow-y: auto;
  border: 1px solid #ccc;
  border-bottom: none;
  margin-top: 10px;
  margin-left: -5px;
  .el-col {
    height: 36px;
    border-bottom: 1px solid #ccc;
    padding: 8px 5px;
    &:nth-child(2n + 1) {
      border-right: 1px solid #ccc;
    }
  }
  .block-head {
    .el-col {
      background-color: #f5f5f5;
    }
  }
}
.no-data {
  padding: 10px;
  text-align: center;
  color: #ccc;
}
</style>
