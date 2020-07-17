<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
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
              <el-form-item>
                <el-input v-model="searchForm.deviceType" clearable :placeholder="$t('invupgrade.invmodel')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduleType" clearable :placeholder="$t('plant.datacolType')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceVersion" :placeholder="$t('invupgrade.invversion')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduleVersion" :placeholder="$t('invupgrade.dataversion')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-shengji" :disabled="deviceSns.length==0" @click="upgradeVisible=true">{{$t('invupgrade.upgrade')}}</el-button>
          <el-button size="mini" icon="iconfont icon-chakan" @click="upstatusVisible=true">{{$t('invupgrade.upstatus')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
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
    <upgrade-dialog :visible.sync="upgradeVisible" :deviceSns="deviceSns"></upgrade-dialog>
    <upstatus-dialog :visible.sync="upstatusVisible"></upstatus-dialog>
    <updetail-dialog :visible.sync="updetailVisible" :taskId="taskId"></updetail-dialog>
  </section>
</template>
<script>
import inverRemoteMix from './components/inverRemoteMix'
import eventBus from './components/eventBus'
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
        deviceVersion: '',
        moduleVersion: '',
        productType: ''
      },
      taskId: '',
      resultList: [{ deviceSN: 12212 }],
      selection: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    deviceSns () {
      return this.selection.map(v => v.deviceSN)
    }
  },
  created () {
    eventBus.$on('openUpdetailDialog', this.openUpdetailDialog)
  },
  methods: {
    reset () {
      this.searchForm = {}
    },
    search () {
      this.currentPage = 1
      this.getList(this.pagination)
    },
    getSelection (select) {
      this.selection = select
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/firmware/device/list',
        method: 'post',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.resultList = result.data || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    },
    openUpdetailDialog (id) {
      this.updetailVisible = true
      this.taskId = id
    }
  }
}
</script>
<style lang="less" scoped>
</style>
