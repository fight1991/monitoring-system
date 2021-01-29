<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" ref="searchForm" :model="searchForm" :rules="rules">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item prop="productType">
                <!-- 产品系列 -->
                <el-select style="width:100%" clearable v-model="searchForm.productType" :placeholder="$t('firmware.proLine')">
                  <el-option v-for="item in productTypeList" :label="item" :value="item" :key="item"></el-option>
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
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterSN" clearable :placeholder="$t('battRemote.bmsMasterSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterVersion" clearable :placeholder="$t('battRemote.bmsMasterVersion')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveSN" clearable :placeholder="$t('battRemote.bmsSlaveSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveVersion" clearable :placeholder="$t('battRemote.bmsSlaveVersion')"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6" align="left">
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
        <common-table :tableHeadData="tableHead" showNum :rowsStatus="showHsearch" :rowsNum="2" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template v-slot:info="{row}">
            <div class="flex-center table-op-btn">
              <i :title="$t('common.view')" v-if="row.batInfo.length>0" class="iconfont icon-look" @click.stop="openbattInfoDialog(row.batInfo)"></i>
              <span v-else>--</span>
            </div>
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
    <upgrade-dialog @refreshList="search" :productType="searchForm.productType" type="battery" :visible.sync="upgradeVisible" :sns="sns"></upgrade-dialog>
    <upstatus-dialog :visible.sync="upstatusVisible" apiUrl="battery"></upstatus-dialog>
    <updetail-dialog :visible.sync="updetailVisible" apiUrl="battery" :taskId="taskId"></updetail-dialog>
    <battInfo-dialog :visible.sync="battInfoVisible" :list="currentBatInfo"></battInfo-dialog>
  </section>
</template>
<script>
import { battery as eventBus } from './common/eventBus'
import upgradeDialog from './components/upgradeDialog'
import updetailDialog from './components/updetailDialog'
import upstatusDialog from './components/upstatusDialog'
import battInfoDialog from './components/battInfoDialog'
export default {
  components: { upgradeDialog, upstatusDialog, updetailDialog, battInfoDialog },
  data () {
    return {
      upgradeVisible: false,
      updetailVisible: false,
      upstatusVisible: false,
      battInfoVisible: false,
      currentBatInfo: [],
      searchForm: {
        moduleSN: '',
        plantName: '',
        deviceSN: '',
        bmsMasterSN: '',
        bmsMasterVersion: '',
        bmsSlaveSN: '',
        bmsSlaveVersion: '',
        productType: '' // 产品/设备系列
      },
      selection: [],
      taskId: '',
      allList: [],
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
      multipleTable: [],
      tableHead: [
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true
        },
        {
          label: 'battRemote.bmsMasterSN',
          prop: 'bmsMasterSN',
          checked: true
        },
        {
          label: 'battRemote.bmsMasterVersion',
          prop: 'bmsMasterVersion',
          checked: true
        },
        {
          label: 'invupgrade.datastatus',
          prop: 'status',
          checked: true,
          slotName: 'status'
        },
        {
          label: 'battRemote.batInfo',
          prop: 'batInfo',
          checked: true,
          width: '60',
          slotName: 'info',
          fixed: 'right'
        }
      ],
      rules: {
        productType: [{ required: true, message: this.messageValid('require'), trigger: 'change' }]
      }
    }
  },
  computed: {
    sns () {
      return this.selection.map(v => v.deviceSN)
    },
    productTypeList () { // 产品型号列表
      let tempList = this.allList.find(v => v.modelType === 3)
      if (tempList) {
        return tempList.productType
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
        moduleSN: '',
        plantName: '',
        deviceSN: '',
        bmsMasterSN: '',
        bmsMasterVersion: '',
        bmsSlaveSN: '',
        bmsSlaveVersion: '',
        productType: ''
      }
      this.$nextTick(() => {
        this.$refs.searchForm.clearValidate()
      })
      this.search()
    },
    searchBtn () {
      let isValid = true
      this.$refs.searchForm.validate(valid => (isValid = valid))
      if (!isValid) return
      this.search()
    },
    search () {
      this.currentPage = 1
      this.getList(this.defaultPage)
      this.selection = []
    },
    openbattInfoDialog (batInfo) {
      this.battInfoVisible = true
      this.currentBatInfo = batInfo
    },
    async getList (pagination) {
      let { result } = await this.$post({
        url: '/c/v0/firmware/battery/list',
        data: {
          ...pagination,
          condition: {
            ...this.searchForm
          }
        }
      })
      if (result) {
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
        this.resultList = result.batteries || []
      }
    },
    openUpdetailDialog (id) {
      this.updetailVisible = true
      this.taskId = id
    },
    // 获取产品型号
    async getProductList () {
      let { result } = await this.$get({
        url: '/c/v0/firmware/products'
      })
      if (result) {
        this.allList = result
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
