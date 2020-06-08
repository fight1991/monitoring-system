<template>
  <section class="sys-main">
    <!-- 查询区域 -->
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm" :inline="true">
          <el-form-item>
            <el-select v-model="searchForm.status">
              <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.status" :key="item.status"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.deviceSN" :placeholder="$t('common.invertSn')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="resetSearchForm">{{$t('common.reset')}}</el-button>
            <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-form>
      </search-bar>
      <!-- 列表查询区域 -->
      <func-bar>
        <common-table :tableHeadData="deviceTableHead" :tableList="resultList" :height="195">
          <template v-slot:status="{row}">
            <!-- 1 正常 2 故障 3 离线 -->
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template v-slot:feedinDate="{row}">
            {{row.feedinDate | formatDate('yyyy-MM-dd')}}
          </template>
        </common-table>
        <div class="states-row">
          <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
          <span><i class="el-icon-error"></i> {{$t('common.abnormal')}}</span>
          <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
        </div>
        <page-box :pagination.sync="pagination" @change="getDeviceList"></page-box>
      </func-bar>
    </div>
  </section>
</template>
<script>
import deviceTableHead from './deviceTableHead'
export default {
  mixins: [deviceTableHead],
  data () {
    return {
      statusList: [ // 0 全部 1 正常 2 不正常  3离线
        { status: 0, label: 'all' },
        { status: 1, label: 'normal' },
        { status: 2, label: 'abnormal' },
        { status: 3, label: 'offline' }
      ],
      searchForm: {
        status: 0, // 0 全部 ，1 正常， 2 异常
        batteryMainSN: '',
        deviceSN: '',
        deviceType: '',
        moduleSN: ''
      },
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      resultList: []
    }
  },
  props: ['id'],
  methods: {
    search (id) {
      this.getDeviceList(this.$store.state.pagination, id)
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
    },
    async getDeviceList (pagination, id) {
      let pages = pagination || this.$store.state.pagination
      let { result } = await this.$axios({
        method: 'post',
        url: '/v0/plant/device/list',
        data: {
          ...pages,
          stationID: this.id || id,
          condition: this.searchForm
        }
      })
      if (result) {
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
        this.resultList = result.devices || []
      }
      return true
    }
  }
}
</script>
<style lang="less" scoped>

</style>
