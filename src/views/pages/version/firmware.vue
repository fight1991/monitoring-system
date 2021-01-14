<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.firmwareVersion" clearable :placeholder="$t('firmware.version')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.modelType" @change="searchForm.softType=''" clearable :placeholder="$t('firmware.devtype')">
                  <el-option v-for="item in modelTypeList" :label="$t(item.label)" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.softType" :disabled="searchForm.modelType!=1" clearable :placeholder="$t('firmware.SoftType')">
                  <el-option v-for="item in versionList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.firmwareStatus" clearable :placeholder="$t('firmware.status')">
                  <el-option v-for="item in statusList" :label="$t(item.label)" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="search"></search-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-import" @click="importVisible=true">{{$t('common.import')}}</el-button>
          <el-button size="mini" icon="iconfont icon-fabu" :disabled="releaseIds.length==0" @click="multiOptions('release')">{{$t('common.release')}}</el-button>
          <el-button size="mini" icon="el-icon-delete" :disabled="deleteIds.length==0" @click="multiOptions('delete')">{{$t('common.delete')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" showNum :pagination="pagination" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:firmwareStatus="{row}">
            {{row.firmwareStatus == 1 ? $t('common.test') : $t('common.rel')}}
          </template>
          <template v-slot:modelType="{row}">
            {{translateDeviceType(row.modelType)}}
          </template>
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
    <import-dialog :visible.sync="importVisible" @refreshList="search"></import-dialog>
  </section>
</template>
<script>
import importDialog from './components/importDialog'
import firmwareMix from './mixins/firmwareMix'
export default {
  components: {
    importDialog
  },
  mixins: [firmwareMix],
  data () {
    return {
      importVisible: false,
      searchForm: {
        firmwareVersion: '',
        modelType: 0,
        firmwareStatus: '',
        softType: ''
      },
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
    releaseIds () {
      let isTest = this.selection.some(v => v.firmwareStatus !== 1)
      if (!isTest) {
        let temp = this.selection.filter(v => v.firmwareStatus === 1)
        return temp.map(v => v.firmwareID)
      }
      return []
    },
    deleteIds () {
      return this.selection.map(v => v.firmwareID)
    }
  },
  created () {
    this.search()
  },
  methods: {
    reset () {
      this.searchForm = {
        firmwareVersion: '',
        modelType: '',
        firmwareStatus: '',
        softType: ''
      }
      this.search()
    },
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    // 批量发布/批量删除
    async multiOptions (op) {
      let { result } = await this.$post({
        url: '/c/v0/firmware/' + op,
        data: {
          firmware: op === 'release' ? this.releaseIds : this.deleteIds
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.search()
      }
    },
    // 获取列表
    async getList (pagination) {
      this.selection = []
      let { result } = await this.$post({
        url: '/c/v0/firmware/list',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.resultList = result.firmwares || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    },
    translateDeviceType (num) {
      switch (num) {
        case 1 :
          return this.$t('common.invert')
        case 2:
          return this.$t('common.module')
        default:
          return this.$t('common.battery')
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
