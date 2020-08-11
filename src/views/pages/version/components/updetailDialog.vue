<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('invupgrade.upDetail')"
    :modal-append-to-body="false"
    @open="search"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="750px">
    <div class="search-form">
      <el-form size="mini" label-width="0px" :model="searchForm">
        <el-form-item>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-input v-model="searchForm.deviceSN" clearable :placeholder="apiUrl=='device' ? $t('common.invertSn') : $t('common.datacolSN') "></el-input>
            </el-col>
            <el-col :span="8" align="left">
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="container flex-column-between" v-setH:min="setDivH-250">
      <func-bar>
        <common-table :tableHeadData="tableHead" :tableList="resultList">
        </common-table>
      </func-bar>
      <div class="page-box">
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      resultList: [{ taskName: 121212 }],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 1000
      },
      searchForm: {
        deviceSN: ''
      },
      tableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true
        }, {
          label: 'invupgrade.preVer',
          prop: 'before',
          checked: true
        }, {
          label: 'invupgrade.upVer',
          prop: 'after',
          checked: true
        }, {
          label: 'invupgrade.status',
          prop: 'status',
          checked: true
        }
      ]
    }
  },
  props: ['visible', 'taskId', 'apiUrl'],
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
      this.searchForm.deviceSN = ''
    }
  },
  created () {},
  mounted () {},
  methods: {
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    closeDialog () {
      this.$emit('update:visible', false)
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/firmware/' + this.apiUrl + '/upgrade/detail',
        globalLoading: true,
        method: 'post',
        data: {
          taskID: this.taskId,
          condition: this.searchForm,
          ...pagination
        }
      })
      if (result) {
        this.resultList = result.details || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.page-box {
  margin-top: 20px;
}
</style>
