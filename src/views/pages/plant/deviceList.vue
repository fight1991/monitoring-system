<template>
  <section>
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
            <search-button type="warning" icon="icon-clear" @click="resetSearchForm()"></search-button>
            <search-button type="success" icon="icon-search" @click="search()"></search-button>
          </el-form-item>
        </el-form>
      </search-bar>
      <!-- 列表查询区域 -->
      <func-bar>
        <common-table :tableHeadData="deviceTableHead" :tableList="resultList" :height="200">
          <template v-slot:status="{row}">
            <!-- 1 正常 2 故障 3 离线 -->
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template v-slot:power="{row}">
            {{toFixed(row.power)}}
          </template>
          <template v-slot:generationToday="{row}">
            {{toFixed(row.generationToday)}}
          </template>
          <template v-slot:generationTotal="{row}">
            {{toFixed(row.generationTotal)}}
          </template>
        </common-table>
        <div class="states-row">
          <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
          <span><i class="el-icon-error"></i> {{$t('common.abnormal')}}</span>
          <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
        </div>
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </func-bar>
    </div>
  </section>
</template>
<script>
import deviceTableHead from './mixins/deviceTableHead'
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
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      resultList: []
    }
  },
  props: ['id'],
  methods: {
    search (id) {
      this.pagination.currentPage = 1
      this.getList(this.pagination, id)
    },
    resetSearchForm (id) {
      this.searchForm = {
        status: 0,
        plantName: '',
        deviceSN: '',
        moduleSN: '',
        country: '',
        deviceType: ''
      }
      this.search(this.pagination, id)
    },
    async getList (pagination, id) {
      let { result } = await this.$post({
        url: '/c/v0/plant/device/list',
        data: {
          ...pagination,
          stationID: id || this.id,
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
