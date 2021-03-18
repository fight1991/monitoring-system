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
                  :picker-options="pickerOptions"
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
        <common-table :tableHeadData="tableHead" showNum :pagination="pagination" :rowsStatus="showHsearch" :rowsNum="2" :tableList="resultList">
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
        alarmType: 0,
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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
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
        alarmType: 0,
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
      this.resultList = []
      this.pagination.currentPage = 1
      this.pagination.total = 0
      this.downloadUrl = ''
    },
    search () {
      if (!(this.times && this.times.length > 0)) {
        this.$message.warning(this.$t('common.dateRange'))
        return
      }
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    download () {
      window.open(this.$store.state.domainName + this.downloadUrl, '_blank')
    },
    async getList (pagination) {
      if (!(this.times && this.times.length > 0)) {
        this.$message.warning(this.$t('common.dateRange'))
        return
      }
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
