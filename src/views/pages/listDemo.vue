<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <!-- 查询区域 -->
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.version" placeholder="版本号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.type" placeholder="choose">
                  <el-option v-for="item in typeList" :label="item.label" :value="item.status" :key="item.status"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.status" placeholder="type">
                  <el-option v-for="(item,index) in statusList" :label="item" :value="item" :key="item + index"></el-option>
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
      <!-- 表格区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-import">导入</el-button>
          <el-button size="mini" icon="el-icon-delete">批量发布</el-button>
          <el-button size="mini" icon="el-icon-delete">批量删除</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :select.sync="selection" :selectBox="true" :tableList="resultList">
        </common-table>
      </func-bar>
    </div>
    <div class="page-list">
      <div class="states-row">
        <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
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
      searchForm: {
        version: '',
        type: '',
        status: ''
      },
      statusList: [],
      resultList: [],
      selection: [],
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
      tableHead: [
        {
          label: '设备类型',
          prop: 'type',
          checked: true
        },
        {
          label: '版本号',
          prop: 'type',
          checked: true
        },
        {
          label: '版本类型',
          prop: 'type',
          checked: true
        },
        {
          label: '审核状态',
          prop: 'type',
          checked: true
        },
        {
          label: '上传时间',
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
        version: '',
        type: '',
        status: ''
      }
      this.search()
    },
    search () {
      this.getList(this.defaultPage)
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
