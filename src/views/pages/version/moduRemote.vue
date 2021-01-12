<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" clearable v-model="searchForm.moduleStatus" :placeholder="$t('plant.equipSta')">
                  <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="searchForm.moduleType" clearable :placeholder="$t('plant.datacolType')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="searchForm.moduleVersion" clearable :placeholder="$t('invupgrade.dataversion')"></el-input>
                </el-form-item>
              </el-col>
            </template>
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
          <el-button size="mini" icon="iconfont icon-shengji" :disabled="sns.length==0" @click="upgradeVisible=true">{{$t('invupgrade.upgrade')}}</el-button>
          <el-button size="mini" icon="iconfont icon-chakan" @click="upstatusVisible=true">{{$t('invupgrade.upstatus')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :rowsStatus="showHsearch" :rowsNum="2" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:moduleStatus="{row}">
            <i class="el-icon-success" v-show="row.moduleStatus==1"></i>
            <i class="el-icon-error" v-show="row.moduleStatus==2"></i>
            <i class="el-icon-remove" v-show="row.moduleStatus==3"></i>
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
    <upgrade-dialog @refreshList="search" type="module" :visible.sync="upgradeVisible" :sns="sns"></upgrade-dialog>
    <upstatus-dialog :visible.sync="upstatusVisible" apiUrl="module"></upstatus-dialog>
    <updetail-dialog :visible.sync="updetailVisible" apiUrl="module" :taskId="taskId"></updetail-dialog>
  </section>
</template>
<script>
import moduRemoteMix from './mixins/moduRemoteMix'
import { module as eventBus } from './common/eventBus'
import upgradeDialog from './components/upgradeDialog'
import updetailDialog from './components/updetailDialog'
import upstatusDialog from './components/upstatusDialog'
export default {
  components: { upgradeDialog, upstatusDialog, updetailDialog },
  mixins: [moduRemoteMix],
  data () {
    return {
      upgradeVisible: false,
      updetailVisible: false,
      upstatusVisible: false,
      searchForm: {
        moduleSN: '',
        plantName: '',
        moduleStatus: '',
        moduleType: '',
        moduleVersion: '',
        upgradeStatus: ''
      },
      taskId: '',
      resultList: [],
      selection: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    sns () {
      return this.selection.map(v => v.moduleSN)
    }
  },
  created () {
    eventBus.$on('openUpdetailDialog', this.openUpdetailDialog)
    this.search()
  },
  methods: {
    reset () {
      this.searchForm = {
        moduleSN: '',
        plantName: '',
        moduleStatus: '',
        moduleType: '',
        moduleVersion: '',
        upgradeStatus: ''
      }
      this.search()
    },
    search () {
      this.currentPage = 1
      this.getList(this.pagination)
    },
    // 获取列表
    async getList (pagination) {
      this.selection = []
      let { result } = await this.$post({
        url: '/c/v0/firmware/module/list',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.resultList = result.modules || []
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
