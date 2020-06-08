<template>
  <section class="sys-main flex-column-between bg-c" v-setH="setDivH">
    <div class="sys-table-container">
      <!-- 查询区域 -->
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.communication" :placeholder="$t('common.select')">
                  <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.status" :key="item.status"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.moduleType" :placeholder="$t('plant.datacolType')">
                  <el-option v-for="(item,index) in typeList" :label="item" :value="item" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <!-- 表格区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-dropdown @command="commandDrop" trigger="click">
            <el-button size="mini" icon="iconfont icon-import" @click="importMulti">{{$t('common.import')}}</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="d">{{$t('common.download')}}</el-dropdown-item>
              <el-upload
                class="dropDown-upload"
                :before-upload="beforeUpload"
                action="http://127.0.0.1">
                <el-dropdown-item command="e" divided>{{$t('common.import')}}</el-dropdown-item>
              </el-upload>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" icon="iconfont icon-unbind" :disabled="access!=255" @click="unbindMulti">{{$t('common.unbind')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
          <template v-slot:status="{row}">
            <i class="el-icon-success" v-show="row.communication==1"></i>
            <i class="el-icon-remove" v-show="row.communication==2"></i>
          </template>
          <template v-slot:signal="{row}">
            <i class="icon icon-signal0" v-show="row.signal==0"></i>
            <i class="icon icon-signal1" v-show="row.signal==1"></i>
            <i class="icon icon-signal2" v-show="row.signal==2"></i>
            <i class="icon icon-signal3" v-show="row.signal==3"></i>
          </template>
          <template v-slot:version="{row}">
            {{row.version || '-'}}
          </template>
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <div class="states-row">
        <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
        <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
      </div>
      <page-box :pagination.sync="pagination" @change="getModuleList"></page-box>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      selection: [],
      statusList: [
        { status: 0, label: 'all' },
        { status: 1, label: 'online' },
        { status: 2, label: 'offline' }
      ],
      searchForm: {
        communication: 0,
        moduleSN: '',
        moduleType: ''
      },
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      resultList: [],
      typeList: [],
      tableHead: [
        {
          label: 'common.datacolSN',
          prop: 'moduleSN',
          checked: true,
          renderHeader: true
        },
        {
          label: 'plant.datacolType',
          prop: 'moduleType',
          checked: true
        },
        {
          label: 'common.plant',
          prop: 'plantName',
          checked: true
        },
        {
          label: 'invupgrade.dataversion',
          prop: 'version',
          checked: true,
          slotName: 'version'
        },
        {
          label: 'common.signal',
          prop: 'signal',
          checked: true,
          slotName: 'signal'
        },
        {
          label: 'common.status',
          prop: 'communication',
          checked: true,
          slotName: 'status'
        }
      ]
    }
  },
  computed: {
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
  },
  methods: {
    getSelection (select) {
      this.selection = select
    },
    resetSearchForm () {
      this.searchForm = {
        communication: 0,
        moduleSN: '',
        moduleType: ''
      }
    },
    reset () {
      this.resetSearchForm()
      this.search()
    },
    search () {
      this.getModuleList(this.$store.state.pagination)
    },
    commandDrop () {

    },
    // 批量导入
    importMulti () {
      // /module/import
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
    // 获取模块列表
    async getModuleList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/module/list',
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
    beforeUpload (file) {
      // excel 或 .csv格式
      let excelType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!excelType.includes(file.type)) {
        this.$message({
          message: 'invalid file type',
          type: 'error'
        })
        return false
      }
      let param = new FormData()
      param.append('file', file, file.name)
      // 文件上传请求
      this.$upload({
        url: '/v0/module/import',
        data: {},
        success: res => {}
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
