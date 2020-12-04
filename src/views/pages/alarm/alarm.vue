<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="7">
                <el-form-item>
                  <el-select style="width:100%" v-model="searchForm.alarmType" clearable :placeholder="$t('common.alarmType')">
                    <el-option v-for="(item, index) in alarmTypeList" :label="$t('alarm.' + item.label)" :value="item.value" :key="item + index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item>
                  <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker
                clearable
                style="width:100%"
                v-model="times"
                type="daterange"
                value-format="yyyy-MM-dd"
                :range-separator="$t('common.to')"
                :start-placeholder="$t('common.start')"
                :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="search"></search-button>
              <search-button type="info" :icon="showHsearch ? 'icon-hs_close' : 'icon-hs_open'" @click="showHsearch=!showHsearch"></search-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" :disabled="!downloadUrl" icon="iconfont icon-downLoad" @click="download">{{$t('common.download')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :rowsStatus="showHsearch" :rowsNum="2" :tableList="resultList">
          <template v-slot:alarmType="{row}">
            {{$t(translateAlarmType(row.alarmType))}}
          </template>
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      downloadUrl: '',
      searchForm: {
        plantName: '',
        deviceSN: '',
        alarmType: '',
        moduleSN: ''
      },
      beginDate: {
        year: 0,
        month: 0,
        day: 0
      },
      endDate: {
        year: 0,
        month: 0,
        day: 0
      },
      times: [],
      alarmTypeList: [
        { value: 0, label: 'all' },
        { value: 1, label: 'comError' },
        { value: 2, label: 'pVBus' },
        { value: 3, label: 'gridError' },
        { value: 4, label: 'tempError' },
        { value: 5, label: 'cpuError' },
        { value: 6, label: 'eps' },
        { value: 7, label: 'outer' }
      ],
      selection: [],
      resultList: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          width: 160
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          width: 160
        },
        {
          label: 'common.alarmType',
          prop: 'alarmType',
          checked: true,
          slotName: 'alarmType'
        },
        {
          label: 'alarm.alarmNum',
          prop: 'alarmCode',
          checked: true
        },
        {
          label: 'alarm.alarmCon',
          prop: 'content',
          checked: true
        },
        {
          label: 'plant.reportTime',
          prop: 'time',
          checked: true
        }
      ]
    }
  },
  created () {
    // this.search()
  },
  methods: {
    resetSearchForm () {
      this.searchForm = {
        plantName: '',
        deviceSN: '',
        alarmType: '',
        moduleSN: ''
      }
      this.beginDate = {
        year: 0,
        month: 0,
        day: 0
      }
      this.endDate = {
        year: 0,
        month: 0,
        day: 0
      }
      this.times = []
    },
    reset () {
      this.resetSearchForm()
    },
    search () {
      if (!(this.times && this.times.length > 0)) {
        this.$message.warning('请选择日期范围')
        return
      }
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    download () {
      window.open(location.origin + this.downloadUrl, '_blank')
    },
    async getList (pagination) {
      this.selection = []
      if (this.times && this.times.length > 0) {
        this.searchForm.beginDate = {
          year: (this.times[0]).split('-')[0],
          month: (this.times[0]).split('-')[1],
          day: (this.times[0]).split('-')[2]
        }
        this.searchForm.endDate = {
          year: (this.times[1]).split('-')[0],
          month: (this.times[1]).split('-')[1],
          day: (this.times[1]).split('-')[2]
        }
      }
      let { result } = await this.$post({
        url: '/c/v0/alarm/query',
        data: {
          ...pagination,
          condition: {
            ...this.searchForm
          },
          beginDate: {
            ...this.searchForm.beginDate
          },
          endDate: {
            ...this.searchForm.endDate
          }
        }
      })
      if (result) {
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
        this.resultList = result.data || []
        this.downloadUrl = result.downloadUrl || ''
      }
    },
    translateAlarmType (num) {
      switch (num) {
        case 0 :
          return 'alarm.all'
        case 1:
          return 'alarm.comError'
        case 2 :
          return 'alarm.pVBus'
        case 3:
          return 'alarm.gridError'
        case 4 :
          return 'alarm.tempError'
        case 5:
          return 'alarm.cpuError'
        case 6 :
          return 'alarm.eps'
        case 7:
          return 'alarm.outer'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
