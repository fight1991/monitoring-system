<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" ref="searchForm" :model="searchForm" :rules="rules">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item prop="productType">
                <!-- 产品系列 -->
                <el-select style="width:100%" @change="inputChange" remote filterable clearable v-model="searchForm.productType" :placeholder="$t('firmware.proLine')">
                  <el-option v-for="item in productTypeList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="deviceType">
                <!-- 设备型号 -->
                <el-select style="width:100%" remote filterable :disabled="!searchForm.productType" clearable v-model="searchForm.deviceType" :placeholder="$t('invupgrade.invmodel')">
                  <el-option v-for="item in deviceTypeList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-select style="width:100%" clearable v-model="searchForm.deviceStatus" :placeholder="$t('plant.equipSta')">
                    <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="softType">
                  <el-select :placeholder="$t('firmware.SoftType')" v-model="searchForm.softType" clearable style="width:100%">
                    <el-option v-for="item in softTypeList" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <!-- 逆变器软件版本 -->
                <el-form-item>
                  <el-input v-model="searchForm.deviceVersion" clearable :placeholder="$t('invupgrade.invversion')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.moduleType" clearable :placeholder="$t('plant.datacolType')"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6" align="left" class="btn-box">
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="searchBtn"></search-button>
              <search-button type="info" :icon="showHsearch ? 'icon-hs_close' : 'icon-hs_open'" @click="showHsearch=!showHsearch"></search-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-shengji" :disabled="sns.length==0" @click="upgradeVisible=true">{{$t('invupgrade.upgrade')}}</el-button>
          <el-button size="mini" icon="iconfont icon-chakan" @click="upstatusVisible=true">{{$t('invupgrade.upstatus')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :rowsStatus="showHsearch" :rowsNum="2" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:deviceStatus="{row}">
            <i class="el-icon-success" v-show="row.deviceStatus==1"></i>
            <i class="el-icon-error" v-show="row.deviceStatus==2"></i>
            <i class="el-icon-remove" v-show="row.deviceStatus==3"></i>
          </template>
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <div class="states-row">
        <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
        <span><i class="el-icon-error"></i> {{$t('common.abnormal')}}</span>
        <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
      </div>
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
    <upgrade-dialog @refreshList="search" :productType="searchForm.productType" type="device" :visible.sync="upgradeVisible" :sns="sns"></upgrade-dialog>
    <upstatus-dialog :visible.sync="upstatusVisible" apiUrl="device"></upstatus-dialog>
    <updetail-dialog :visible.sync="updetailVisible" apiUrl="device" :taskId="taskId"></updetail-dialog>
  </section>
</template>
<script>
import inverRemoteMix from './mixins/inverRemoteMix'
import { device as eventBus } from './common/eventBus'
import upgradeDialog from './components/upgradeDialog'
import updetailDialog from './components/updetailDialog'
import upstatusDialog from './components/upstatusDialog'
export default {
  components: { upgradeDialog, upstatusDialog, updetailDialog },
  mixins: [inverRemoteMix],
  data () {
    return {
      upgradeVisible: false,
      updetailVisible: false,
      upstatusVisible: false,
      searchForm: {
        deviceSN: '',
        moduleSN: '',
        plantName: '',
        deviceStatus: '',
        deviceType: '',
        moduleType: '',
        softType: '',
        deviceVersion: '',
        productType: '' // 产品/设备系列
      },
      allList: [],
      softTypeList: [ // 软件类别
        'master',
        'slave',
        'manager'
      ],
      taskId: '',
      resultList: [],
      selection: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      rules: {
        productType: [{ required: true, message: this.messageValid('require'), trigger: 'change' }],
        deviceType: [{ required: true, message: this.messageValid('require'), trigger: 'change' }]
      }
    }
  },
  computed: {
    sns () {
      return this.selection.map(v => v.deviceSN)
    },
    productTypeList () { // 产品型号列表
      let tempList = this.allList.find(v => v.modelType === 1)
      if (tempList) {
        return tempList.productType
      }
      return []
    },
    deviceTypeList () { // 设备型号
      let tempList = this.allList.find(v => v.modelType === 1)
      if (tempList && this.searchForm.productType) {
        return tempList.deviceType[this.searchForm.productType]
      }
      return []
    }
  },
  created () {
    eventBus.$on('openUpdetailDialog', this.openUpdetailDialog)
    this.getProductList()
  },
  methods: {
    reset () {
      this.searchForm = {
        deviceSN: '',
        moduleSN: '',
        plantName: '',
        deviceStatus: '',
        deviceType: '',
        moduleType: '',
        deviceVersion: '',
        moduleVersion: '',
        productType: ''
      }
      this.resultList = []
      this.$nextTick(() => {
        this.$refs.searchForm.clearValidate()
      })
    },
    inputChange () {
      this.searchForm.deviceType = ''
      this.$nextTick(() => {
        this.$refs.searchForm.clearValidate('deviceType')
      })
    },
    searchBtn () {
      let isValid = true
      this.$refs.searchForm.validate(valid => (isValid = valid))
      if (!isValid) return
      this.search()
    },
    search () {
      this.currentPage = 1
      this.getList(this.pagination)
      this.selection = []
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$post({
        url: '/v0/firmware/device/list',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.resultList = result.devices || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    },
    openUpdetailDialog (id) {
      this.updetailVisible = true
      this.taskId = id
    },
    // 获取产品型号
    async getProductList () {
      let { result } = await this.$get({
        url: '/v0/firmware/products'
      })
      if (result) {
        this.allList = result
      }
    }
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
