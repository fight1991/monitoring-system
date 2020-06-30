<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <!-- 查询区域 -->
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.status" :placeholder="$t('common.select')">
                  <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.status" :key="item.status"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
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
                  :range-separator="$t('common.to')"
                  :start-placeholder="$t('common.start')"
                  :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.moduleType" :placeholder="$t('plant.datacolType')">
                  <el-option v-for="(item,index) in typeList" :label="item" :value="item" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.country" clearable :placeholder="$t('plant.country')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceType" clearable :placeholder="$t('invupgrade.invmodel')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" align="left">
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <!-- 列表查询区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-dropdown @command="commandDrop" trigger="click">
            <el-button size="mini" icon="iconfont icon-import" :disabled="access!=255">{{$t('common.import')}}</el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- 模板下载 -->
              <el-dropdown-item command="d">{{$t('common.download')}}</el-dropdown-item>
              <!-- 导入 -->
              <el-upload
                :show-file-list="false"
                class="dropDown-upload"
                :http-request="beforeUpload"
                action="http://127.0.0.1">
                <el-dropdown-item command="e" divided>{{$t('common.import')}}</el-dropdown-item>
              </el-upload>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" icon="iconfont icon-unbind" :disabled="access!=255 || bindIds.length < 1" @click="unbindMulti">{{$t('common.unbind')}}</el-button>
          <el-button size="mini" icon="el-icon-delete" :disabled="access!=255" @click="deleteInverter">{{$t('common.delete')}}</el-button>
        </el-row>
        <common-table :tableHeadData="inverterTableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <!-- 1 正常 2 故障 3 离线 -->
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template v-slot:op="{row}">
            <div class="flex-center table-op-btn">
              <i title="view" class="iconfont icon-look" @click="goToDetail('look', row.deviceID)"></i>
              <i title="remote setting" class="iconfont icon-remote-setting" v-show="false" @click="goToDetail('set', row.deviceID)"></i>
            </div>
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
          <template v-slot:signal="{row}">
            <i class="icon icon-signal0" v-show="row.signal==0"></i>
            <i class="icon icon-signal1" v-show="row.signal==1"></i>
            <i class="icon icon-signal2" v-show="row.signal==2"></i>
            <i class="icon icon-signal3" v-show="row.signal==3"></i>
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
      typeList: [],
      searchForm: {
        status: 0,
        plantName: '',
        deviceSN: '',
        moduleSN: '',
        country: '',
        deviceType: '',
        moduleType: ''
      },
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
    },
    bindIds () {
      return this.selection.map(v => {
        return {
          moduleSN: v.moduleSN,
          stationID: v.stationID
        }
      })
    }
  },
  created () {
    this.getModuleTypeList()
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
      this.getInverterList(this.defaultPage)
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
    },
    // 获取模块类型列表
    async getModuleTypeList () {
      let { result } = await this.$axios({
        url: '/v0/module/types'
      })
      if (result) {
        this.typeList = result.types || []
      }
    },
    commandDrop (type) {
      if (type === 'd') {
        this.downloadModule()
      }
    },
    // 模板下载
    downloadModule () {
      window.open('http://www.foxesscloud.com/template/modules.csv', '_blank')
    },
    // 读取文件信息
    beforeUpload ({ file }) {
      // excel 或 .csv格式
      let excelType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!excelType.includes(file.type)) {
        this.$message({
          message: 'invalid file type',
          type: 'error'
        })
        return false
      }
      this.importFile(file)
    },
    // 导入文件
    importFile (file) {
      let upfile = new FormData()
      upfile.append('upfile', file)
      // 文件上传请求
      this.$upload({
        url: '/v0/module/import',
        data: upfile,
        success: res => {
          this.search()
        }
      })
    },
    // 批量解绑
    async unbindMulti () {
      let { result } = await this.$axios({
        url: '/v0/module/disable',
        data: {
          modules: this.bindIds
        }
      })
      if (result) {
        this.search()
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
