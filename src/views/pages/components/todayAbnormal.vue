<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('plant.todayAbSta')"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @opened="search"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="750px">
    <search-bar>
      <el-form size="mini" label-width="0px" :model="searchForm" :inline="true">
        <el-form-item v-if="type==='plant'">
          <el-input v-model="searchForm.deviceSN" :placeholder="$t('common.invertSn')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.alarmType" :placeholder="$t('common.alarmType')">
            <el-option v-for="item in alarmTypeList" :label="$t('common.' + item.label)" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
          <search-button type="success" icon="icon-search" @click="search"></search-button>
        </el-form-item>
      </el-form>
    </search-bar>
    <div class="container flex-column-between" v-setH:min="setDivH-250">
      <func-bar>
        <common-table :tableHeadData="tableHead" :tableList="resultList">
          <template #alarmType="{row}">
            {{$t('common.' + alarmTypeList[row.alarmType]['label'])}}
          </template>
        </common-table>
      </func-bar>
      <div class="page-box">
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      resultList: [],
      searchForm: {
        deviceSN: '',
        alarmType: 0
      },
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
      ],
      tableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: false
        }, {
          label: 'common.alarmType',
          prop: 'alarmType',
          checked: true,
          slotName: 'alarmType'
        }, {
          label: 'plant.errorCode',
          prop: 'code',
          checked: true
        }, {
          label: 'plant.errorName',
          prop: 'content',
          checked: true
        }, {
          label: 'plant.reportTime',
          prop: 'time',
          checked: true
        }
      ]
    }
  },
  props: {
    visible: {
      default: false
    },
    type: {
      default: 'plant'
    },
    todayFault: {
      default: 0
    },
    contentH: {
      default: 200
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  created () {
    if (this.type === 'plant') {
      this.tableHead[0].checked = true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    reset () {
      this.searchForm = {
        deviceSN: '',
        alarmType: 0
      }
      this.search()
    },
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    async getList (pagination) {
      let params = {}
      if (this.type === 'plant') {
        params.stationID = this.$attrs.id
      } else {
        params.deviceID = this.$attrs.id
      }
      let { result } = await this.$post({
        url: `/c/v0/${this.type}/alarm/today/detail`,
        globalLoading: true,
        data: {
          ...params,
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
        this.resultList = result.data || []
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .el-icon-more {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .item-op {
    cursor: pointer;
    color: #F96867;
    font-size: 32px;
  }
  .icon-alarm-total {
    font-size: 180px;
    color: #F96867;
  }
</style>
