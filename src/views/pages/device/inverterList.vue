<template>
  <section class="sys-main flex-column-between bg-c" v-setH="setDivH">
    <!-- 查询区域 -->
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.status" :placeholder="$t('common.select')">
                  <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.status" :key="item.status"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.country" clearable :placeholder="$t('plant.country')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.deviceType" clearable :placeholder="$t('invupgrade.invmodel')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  clearable
                  style="width:100%"
                  v-model="times"
                  value-format="timestamp"
                  type="daterange"
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
          <el-button size="mini" icon="el-icon-delete" :disabled="access!=255" @click="deleteInverter">{{$t('common.delete')}}</el-button>
        </el-row>
        <common-table :tableHeadData="inverterTableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <!-- 1 正常 2 故障 3 离线 -->
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template v-slot:feedinDate="{row}">
            {{Number(row.feedinDate )| formatDate('yyyy-MM-dd')}}
          </template>
          <template v-slot:op="{row}">
            <div class="flex-center table-op-btn">
              <i title="view" class="iconfont icon-look" @click="goToDetail('look', row.deviceID)"></i>
              <i title="remote setting" class="iconfont icon-remote-setting" @click="goToDetail('set', row.deviceID)"></i>
            </div>
          </template>
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <div class="states-row">
        <span><i class="el-icon-success"></i> {{$t('common.normal')}}: {{statusAll.normal}}</span>
        <span><i class="el-icon-error"></i> {{$t('common.abnormal')}}: {{statusAll.fault}}</span>
        <span><i class="el-icon-remove"></i> {{$t('common.offline')}}: {{statusAll.offline}}</span>
      </div>
      <page-box :pagination.sync="pagination" @change="getInverterList"></page-box>
    </div>
  </section>
</template>
<script>
import inverterTableHead from './inverterTableHead'
export default {
  mixins: [inverterTableHead],
  data () {
    return {
      selection: [],
      times: [],
      statusList: [
        { status: 0, label: 'all' },
        { status: 1, label: 'normal' },
        { status: 2, label: 'abnormal' },
        { status: 3, label: 'offline' }
      ],
      searchForm: {
        status: 0,
        plantName: '',
        deviceSN: '',
        moduleSN: '',
        country: '',
        deviceType: ''
      },
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      resultList: [],
      statusAll: {
        normal: 0,
        fault: 0,
        offline: 0
      }
    }
  },
  computed: {
    deviceId () {
      return this.selection.map(v => v.deviceID)
    }
  },
  created () {
    this.search()
    this.getStatusAll()
  },
  methods: {
    getSelection (select) {
      this.selection = select
    },
    resetSearchForm () {
      this.searchForm = {
        status: 0,
        plantName: '',
        deviceSN: '',
        moduleSN: '',
        country: '',
        deviceType: ''
      }
      this.times = []
    },
    reset () {
      this.resetSearchForm()
      this.search()
    },
    search () {
      this.getInverterList(this.$store.state.pagination)
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
    getInverterList (pagination) {
      this.$post({
        url: '/v0/device/list',
        data: {
          ...pagination,
          condition: {
            ...this.searchForm,
            queryDate: {
              begin: (this.times && this.times[0]) || 0,
              end: (this.times && this.times[1]) || 0
            }
          }
        },
        success: ({ result }) => {
          if (result) {
            this.pagination.total = result.total
            this.pagination.currentPage = result.currentPage
            this.pagination.pageSize = result.pageSize
            this.resultList = result.devices || []
          }
        }
      })
    },
    // 获取所有逆变器状态
    async getStatusAll () {
      let { result } = await this.$axios({
        url: 'v0/device/status/all'
      })
      if (result) {
        this.statusAll = result
      }
    },
    // 删除逆变器
    async deleteInverter () {
      if (this.deviceId.length === 0) {
        this.$message.warning('Please check an option')
        return
      }
      let { result } = await this.$axios({
        url: '/v0​/device/delete',
        method: 'post',
        data: this.deviceId
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
