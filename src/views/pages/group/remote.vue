<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <!-- 查询区域 -->
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.nmi" clearable :placeholder="$t('sapn.nmi')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.groups" :placeholder="$t('sapn.group')" multiple clearable>
                  <el-option v-for="item in groupList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
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
                  <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
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
      <!-- 表格区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-shutdown" :disabled="devices.length==0" @click="shutdown">{{$t('sapn.shutdown')}}</el-button>
          <el-button size="mini" icon="iconfont icon-shutdown" :disabled="devices.length==0" @click="boot">{{$t('sapn.boot')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :select.sync="selection" :rowsStatus="showHsearch" :rowsNum="2" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <i class="el-icon-success" v-show="row.status==1"></i>
            <i class="el-icon-error" v-show="row.status==2"></i>
            <i class="el-icon-remove" v-show="row.status==3"></i>
          </template>
          <template #generationToday="{row}">
            {{toFixed(row.generationToday)}}
          </template>
          <template #power="{row}">
            {{toFixed(row.power)}}
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
  </section>
</template>
<script>
export default {
  data () {
    return {
      selection: [],
      searchForm: {
        nmi: '',
        groups: [],
        deviceSN: '',
        moduleSN: '',
        plantName: ''
      },
      groupList: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      resultList: [],
      tableHead: [
        {
          label: 'sapn.nmi',
          prop: 'nmi',
          checked: true,
          width: 120
        },
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          width: 150
        },
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          width: 150
        },
        {
          label: 'sapn.instCap',
          prop: 'capacity',
          checked: true
        },
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'plant.address',
          prop: 'address',
          checked: true
        },
        {
          label: 'common.postcode',
          prop: 'postcode',
          checked: true
        },
        {
          label: 'common.currentP',
          prop: 'power',
          checked: true,
          slotName: 'power'
        },
        {
          label: 'plant.genTod',
          prop: 'generationToday',
          checked: true,
          width: 120,
          slotName: 'generationToday'
        },
        {
          label: 'common.status',
          prop: 'status',
          checked: true,
          slotName: 'status',
          fixed: 'right'
        }
      ]
    }
  },
  computed: {
    devices () {
      return this.selection.map(v => v.deviceID)
    }
  },
  created () {
    this.getGroupList()
    this.search()
  },
  methods: {
    resetSearchForm () {
      this.searchForm = {
        nmi: '',
        groups: [],
        deviceSN: '',
        moduleSN: '',
        plantName: ''
      }
    },
    reset () {
      this.resetSearchForm()
      this.search()
    },
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    // 远程关机
    async shutdown () {
      let { result } = await this.$post({
        url: '/sapn/v0/device/remote/disconnection',
        data: {
          devices: this.devices
        }
      })
      if (result) {
        this.selection = []
        let opStatus = await this.$openConfirm({
          showHeader: false,
          content: this.$t('common.success') + ' , ' + this.$t('common.tips3'),
          type: 'success'
        })
        if (opStatus) {
          window.open(result.downloadUrl, '_blank')
        }
      }
    },
    // 远程开机
    async boot () {
      let { result } = await this.$post({
        url: '/sapn/v0/device/remote/reconnection',
        data: {
          devices: this.devices
        }
      })
      if (result) {
        this.selection = []
        let opStatus = await this.$openConfirm({
          showHeader: false,
          content: this.$t('common.success') + ' , ' + this.$t('common.tips3'),
          type: 'success'
        })
        if (opStatus) {
          window.open(result.downloadUrl, '_blank')
        }
      }
    },
    // 获取组列表
    async getGroupList () {
      let { result } = await this.$get({
        url: '/sapn/v0/device/schedule/groups'
      })
      if (result) {
        this.groupList = result.groups
      }
    },
    // 获取模块列表
    async getList (pagination) {
      this.selection = []
      let { result } = await this.$post({
        url: '/sapn/v0/device/schedule/list',
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>
