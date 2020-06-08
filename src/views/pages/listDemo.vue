<template>
  <section class="sys-main">
    <div class="sys-table-container">
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
                <el-select style="width:100%" v-model="searchForm.moduleType" placeholder="type">
                  <el-option v-for="(item,index) in versionList" :label="item" :value="item" :key="item + index"></el-option>
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
              <el-button size="mini" @click="reset">重置</el-button>
              <el-button type="primary" size="mini" @click="search">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-import">导入</el-button>
          <el-button size="mini" icon="el-icon-delete">批量发布</el-button>
          <el-button size="mini" icon="el-icon-delete">批量删除</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :tableList="resultList">
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
