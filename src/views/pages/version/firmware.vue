<template>
  <section class="sys-main">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.version" clearable :placeholder="$t('firmware.version')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.type" clearable :placeholder="$t('firmware.devicetype')">
                  <el-option v-for="item in typeList" :label="item.label" :value="item.status" :key="item.status"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.moduleType" clearable :placeholder="$t('firmware.type')">
                  <el-option v-for="(item,index) in versionList" :label="item" :value="item" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.status" clearable :placeholder="$t('firmware.status')">
                  <el-option v-for="(item,index) in statusList" :label="item" :value="item" :key="item + index"></el-option>
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
          <el-button size="mini" icon="iconfont icon-import">{{$t('common.import')}}</el-button>
          <el-button size="mini" icon="iconfont icon-fabu">{{$t('common.release')}}</el-button>
          <el-button size="mini" icon="el-icon-delete">{{$t('common.delete')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :height="530" :tableList="resultList">
          <template v-slot:time="{row}">
            {{Number(row.time )| formatDate('yyyy-MM-dd')}}
          </template>
        </common-table>
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </func-bar>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {},
      versionList: [], // 版本类型
      typeList: [], // 设备类型
      statusList: [], // 审核状态
      resultList: [],
      selection: [],
      pagination: {
        pageSize: 10,
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
      this.searchForm = {}
    },
    search () {

    },
    getSelection (select) {
      this.selection = []
    },
    // 获取列表
    async getList (pagination) {
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
