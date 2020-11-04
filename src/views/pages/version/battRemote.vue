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
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterSN" clearable :placeholder="$t('battRemote.bmsMasterSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterVersion" clearable :placeholder="$t('battRemote.bmsMasterVersion')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveSN" clearable :placeholder="$t('battRemote.bmsSlaveSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveVersion" clearable :placeholder="$t('battRemote.bmsSlaveVersion')"></el-input>
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
          <el-button size="mini" icon="iconfont icon-shengji" :disabled="selection.length==0" @click="upgradeVisible=true">{{$t('invupgrade.upgrade')}}</el-button>
          <el-button size="mini" icon="iconfont icon-chakan" @click="upstatusVisible=true">{{$t('invupgrade.upstatus')}}</el-button>
          <el-button size="mini" icon="iconfont icon-shengji" @click="check">选中</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :rowsStatus="showHsearch" :rowsNum="2" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
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
import upgradeDialog from './components/upgradeDialog'
import updetailDialog from './components/updetailDialog'
import upstatusDialog from './components/upstatusDialog'
export default {
  components: { upgradeDialog, upstatusDialog, updetailDialog },
  data () {
    return {
      upgradeVisible: false,
      updetailVisible: false,
      upstatusVisible: false,
      searchForm: {
        moduleSN: '',
        plantName: '',
        deviceSN: '',
        bmsMasterSN: '',
        bmsMasterVersion: '',
        bmsSlaveSN: '',
        bmsSlaveVersion: ''
      },
      taskId: '',
      selection: [],
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
          label: 'battRemote.batType',
          prop: 'batType',
          checked: true
        },
        {
          label: 'battRemote.bmsSlaveSN',
          prop: 'sn',
          checked: true
        },
        {
          label: 'battRemote.bmsSlaveVersion',
          prop: 'version',
          checked: true
        },
        {
          label: 'invupgrade.datastatus',
          prop: 'status',
          checked: true,
          slotName: 'status'
        }
      ]
    }
  },
  computed: {
    sns () {
      return this.selection.map(v => v.deviceSN)
    }
  },
  created () {
    this.search()
    this.getList(this.defaultPage)
  },
  methods: {
    check () {
      console.log(this.selection.map(sns => sns.deviceSN))
    },
    reset () {
      this.searchForm = {
        moduleSN: '',
        plantName: '',
        deviceSN: '',
        bmsMasterSN: '',
        bmsMasterVersion: '',
        bmsSlaveSN: '',
        bmsSlaveVersion: ''
      }
      this.search()
    },
    search () {
      this.currentPage = 1
      this.getList(this.defaultPage)
      this.selection = []
    },
    async getList (pagination) {
      let { result } = await this.$post({
        url: '/v0/firmware/battery/list',
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
