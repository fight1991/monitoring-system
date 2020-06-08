<template>
  <div style="width:100%">
    <el-card shadow="never">
      <div class="title border-line" slot="header">
        {{$t('plant.todayAb')}}
        <i class="fr el-icon-more" @click="dialogVisible=true"></i>
      </div>
      <div class="abnormal-content flex-around" :style="{'height': contentH + 'px'}">
        <i class="iconfont icon-alarm-total"></i>
        <div class="item-op flex-center" title="view" @click="dialogVisible=true">
          {{todayFault}}
        </div>
      </div>
    </el-card>
    <el-dialog
      class="sys-dialog"
      :title="$t('plant.todayAbSta')"
      :modal-append-to-body="false"
      @opened="search"
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="700px">
      <div class="content">
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
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-form-item>
          </el-form>
        </search-bar>
        <func-bar>
          <el-table size="mini" :height="400" :data="resultList" border>
            <el-table-column :label="$t('common.invertSn')" prop="deviceSN" v-if="type==='plant'"></el-table-column>
            <el-table-column :label="$t('common.alarmType')" prop="alarmType"></el-table-column>
            <el-table-column :label="$t('plant.errorCode')" prop="code"></el-table-column>
            <el-table-column :label="$t('plant.errorName')" prop="content"></el-table-column>
            <el-table-column :label="$t('plant.reportTime')" prop="time">
              <template slot-scope="scope">
                {{ scope.row.time | formatDate}}
              </template>
            </el-table-column>
          </el-table>
          <page-box :pagination.sync="pagination" @change="getList"></page-box>
        </func-bar>
      </div>
    </el-dialog>
  </div>
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
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    reset () {
      this.searchForm = {
        deviceSN: '',
        alarmType: 0
      }
    },
    search () {
      this.getList(this.$store.state.pagination)
    },
    async getList (pagination) {
      let params = {}
      if (this.type === 'plant') {
        params.stationID = this.$attrs.id
      } else {
        params.deviceID = this.$attrs.id
      }
      let { result } = await this.$axios({
        method: 'post',
        url: `/v0/${this.type}/alarm/today/detail`,
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
