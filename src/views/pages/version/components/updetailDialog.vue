<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('invupgrade.upDetail')"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @open="search"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="80%">
    <div class="search-form">
      <el-form size="mini" label-width="0px" :model="searchForm">
        <el-form-item>
          <el-row :gutter="15">
            <el-col :span="8">
              <el-input v-model="searchForm.deviceSN" clearable :placeholder="apiUrl=='device' ? $t('common.invertSn') : $t('common.datacolSN')"></el-input>
            </el-col>
            <el-col :span="8" align="left">
              <el-button type="primary" size="mini" @click="search('handClick')">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div class="container flex-column-between" v-setH:min="setDivH-250">
      <func-bar>
        <common-table :tableHeadData="tableHead" :tableList="resultList">
          <template #progress="{row}">
            <el-progress v-if="getProgressInfo(row)['isShow']" :percentage="getProgressInfo(row)['value']" color="#67c23a"></el-progress>
            <span v-else>--</span>
          </template>
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
      timer: null,
      resultList: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      searchForm: {
        deviceSN: ''
      },
      tableHead: [
        {
          label: 'common.invertSn',
          prop: 'deviceSN',
          checked: true,
          width: 150
        }, {
          label: 'invupgrade.curVer',
          prop: 'before',
          checked: true
        }, {
          label: 'navBar.firmware',
          prop: 'after',
          checked: true
        }, {
          label: 'invupgrade.status',
          prop: 'status',
          checked: true
        }, {
          label: 'invupgrade.progress',
          prop: 'progress',
          checked: true,
          slotName: 'progress',
          width: 120
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
  created () {
    if (this.apiUrl === 'module') {
      this.tableHead[0].label = 'common.datacolSN'
    }
  },
  mounted () {},
  beforeDestroy () {
    this.clearTimer()
  },
  methods: {
    search (from) {
      this.pagination.currentPage = 1
      if (from) { // 手动点击查询按钮, 清除定时器
        this.clearTimer()
      }
      this.getList(this.pagination)
    },
    // 是否显示进度条及显示的值
    getProgressInfo (row) {
      let isShow = ['upgrading', 'transgerring', 'completed'].includes(row.status)
      let value = row.status === 'completed' ? 100 : (Number(row.progress) || 0)
      return { isShow, value }
    },
    // 清除定时器
    clearTimer () {
      this.timer && clearInterval(this.timer)
      this.timer = null
    },
    // 关闭对话框
    closeDialog () {
      this.$emit('update:visible', false)
      this.clearTimer()
    },
    // 获取列表
    async getList (pagination, openLoading = true) {
      let { result, other, error } = await this.$post({
        url: '/c/v0/firmware/' + this.apiUrl + '/upgrade/detail',
        globalLoading: true,
        isLoad: openLoading,
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
        // 开启定时器, 每15s查询一次
        if (this.timer) return
        this.timer = setInterval(() => {
          this.getList(this.pagination, false)
        }, 5000)
      }
      if (other || error) {
        this.clearTimer()
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
