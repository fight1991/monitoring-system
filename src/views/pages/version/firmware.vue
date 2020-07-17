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
                <el-select style="width:100%" v-model="searchForm.modelType" @change="searchForm.softType=''" clearable :placeholder="$t('firmware.devicetype')">
                  <el-option v-for="item in modelTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.softType" :disabled="searchForm.modelType!=1" clearable :placeholder="$t('firmware.type')">
                  <el-option v-for="item in versionList" :label="item" :value="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.firmwareStatus" clearable :placeholder="$t('firmware.status')">
                  <el-option v-for="item in statusList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
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
          <el-button size="mini" icon="iconfont icon-import" @click="importVisible=true">{{$t('common.import')}}</el-button>
          <el-button size="mini" icon="iconfont icon-fabu">{{$t('common.release')}}</el-button>
          <el-button size="mini" icon="el-icon-delete">{{$t('common.delete')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
    <import-dialog :visible.sync="importVisible"></import-dialog>
  </section>
</template>
<script>
import importDialog from './importDialog'
export default {
  components: {
    importDialog
  },
  data () {
    return {
      importVisible: false,
      searchForm: {
        firmwareVersion: '',
        modelType: '',
        firmwareStatus: '',
        softType: ''
      },
      versionList: [ // 版本类型
        'master',
        'slave',
        'manager'
      ],
      modelTypeList: [ // 设备类型
        {
          label: '全部',
          value: 0
        }, {
          label: '逆变器',
          value: 1
        }, {
          label: '模块',
          value: 2
        }, {
          label: '电池',
          value: 3
        }
      ],
      statusList: [ // 固件状态
        {
          label: '全部',
          value: 0
        }, {
          label: '测试',
          value: 1
        }, {
          label: '发布',
          value: 2
        }
      ],
      resultList: [],
      selection: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'firmware.devicetype',
          prop: 'type',
          checked: true
        },
        {
          label: 'firmware.version',
          prop: 'type',
          checked: true
        },
        {
          label: 'firmware.type',
          prop: 'type',
          checked: true
        },
        {
          label: 'firmware.status',
          prop: 'type',
          checked: true
        },
        {
          label: 'firmware.uptime',
          prop: 'time',
          checked: true,
          slotName: 'time'
        }
      ]
    }
  },
  methods: {
    reset () {
      this.searchForm = {
        firmwareVersion: '',
        modelType: '',
        firmwareStatus: '',
        softType: ''
      }
    },
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    getSelection (select) {
      this.selection = []
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/firmware​/list',
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
