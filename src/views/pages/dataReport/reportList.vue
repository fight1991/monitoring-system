<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <!-- 查询区域 -->
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="8">
              <el-form-item>
                <el-input v-model="searchForm.sn" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker
                  clearable
                  style="width:100%"
                  v-model="times"
                  value-format="timestamp"
                  type="daterange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('common.to')"
                  :start-placeholder="$t('common.start')"
                  :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <!-- 列表查询区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" v-show="access==3" icon="iconfont icon-downLoad" :disabled="!downloadUrl" @click="download">{{$t('common.download')}}</el-button>
        </el-row>
        <common-table :tableHeadData="reportTableHead" :tableList="resultList">
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
  </section>
</template>
<script>
import reportTableHead from './reportTableHead'
export default {
  mixins: [reportTableHead],
  data () {
    return {
      downloadUrl: '',
      selection: [],
      times: [],
      searchForm: {
        sn: '',
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
        validity: 24 * 60
      },
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      resultList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.search()
  },
  methods: {
    download () {
      window.open(process.env.VUE_APP_API + this.downloadUrl, '_blank')
    },
    resetSearchForm () {
      this.searchForm = {
        sn: '',
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
        validity: 24 * 60
      }
      this.times = []
    },
    reset () {
      this.resetSearchForm()
      this.search()
    },
    search () {
      this.getList(this.$store.state.pagination)
    },
    goToDetail (page, id) {
      let routeName = page === 'look' ? 'bus-device-inverterDetail' : 'bus-device-remoteSetting'
      this.$tab.replace({
        name: routeName,
        query: {
          id
        }
      })
    },
    // 获取列表
    async getList (pagination) {
      if (this.times && this.times.length > 0) {
        this.searchForm.beginDate = {
          year: new Date(this.times[0]).getFullYear(),
          month: new Date(this.times[0]).getMonth() + 1,
          day: new Date(this.times[0]).getDate()
        }
        this.searchForm.endDate = {
          year: new Date(this.times[1]).getFullYear(),
          month: new Date(this.times[1]).getMonth() + 1,
          day: new Date(this.times[1]).getDate()
        }
      }
      let { result, error, other } = await this.$axios({
        url: '/v0/device/report/query',
        method: 'post',
        data: {
          ...pagination,
          ...this.searchForm
        }
      })
      if (result) {
        this.resultList = result.data || []
        this.downloadUrl = result.downloadUrl || ''
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
      if (error || other) {
        this.downloadUrl = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
