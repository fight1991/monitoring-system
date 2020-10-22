<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                clearable
                style="width:100%"
                v-model="times"
                type="daterange"
                @change="changeDate"
                value-format="yyyy-MM-dd"
                :range-separator="$t('common.to')"
                :start-placeholder="$t('common.start')"
                :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="3">
                <el-form-item>
                  <el-select style="width:100%" v-model="searchForm.alarmType" clearable :placeholder="$t('common.alarmType')">
                    <el-option v-for="(item, index) in alarmTypeList" :label="$t('alarm.' + item.label)" :value="item.value" :key="item + index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6" align="left">az
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="search"></search-button>
              <search-button type="info" :icon="showHsearch ? 'icon-hs_close' : 'icon-hs_open'" @click="showHsearch=!showHsearch"></search-button>
            </el-col>
          </el-row>
        </el-form>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-downLoad" @click="download">{{$t('common.download')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead"  :rowsStatus="showHsearch" :rowsNum="2" :select.sync="selection" :selectBox="true" :tableList="resultList"></common-table>
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
      defaultPage: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'common.plant',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.invertSn',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.datacolSN',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.alarmType',
          prop: 'type',
          checked: true
        },
        {
          label: 'alarm.alarmNum',
          prop: 'type',
          checked: true
        },
        {
          label: 'alarm.alarmCon',
          prop: 'type',
          checked: true
        },
        {
          label: 'plant.reportTime',
          prop: 'time',
          checked: true,
          slotName: 'time'
        }
      ]
    }
  },
  created () {
    this.getList(this.defaultPage)
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
      this.search()
    },
    search () {
      this.getList(this.defaultPage)
      this.selection = []
    },
    download () {
      alert('下载')
    },
    changeDate () {
      console.log(this.times)
    },
    async getList (pagination) {
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
      console.log(this.searchForm)
      let { result } = await this.$post({
        url: '/v0/alarm/query',
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
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
