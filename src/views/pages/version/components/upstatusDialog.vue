<template>
  <el-dialog
    class="sys-dialog"
    :title="'升级状态'"
    :modal-append-to-body="false"
    @close="$emit('update:visible', false)"
    :visible.sync="dialogVisible"
    width="750px">
    <div class="container flex-column-between" v-setH:min="setDivH-250">
      <func-bar>
        <common-table :tableHeadData="tableHead" :tableList="resultList">
          <template v-slot:op="{row}">
            <div class="flex-center table-op-btn">
              <i title="view" class="iconfont icon-look" @click="openDialog(row.taskID)"></i>
            </div>
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
import eventBus from './eventBus'
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      resultList: [{ taskName: 121212, taskID: 1212 }],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 1000
      },
      tableHead: [
        {
          label: '任务名',
          prop: 'taskName',
          checked: true
        }, {
          label: '任务总数',
          prop: 'total',
          checked: true
        }, {
          label: '升级完成数量',
          prop: 'upgraded',
          checked: true
        }, {
          label: '升级中数量',
          prop: 'upgrading',
          checked: true
        }, {
          label: '升级失败数量',
          prop: 'failed',
          checked: true
        }, {
          label: '操作',
          prop: 'op',
          slotName: 'op',
          checked: true
        }
      ]
    }
  },
  props: ['visible'],
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/firmware/device/upgrade/status',
        method: 'post',
        data: {
          ...pagination
        }
      })
      if (result) {
        this.resultList = result.tasks || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    },
    openDialog (id) {
      eventBus.$emit('openUpdetailDialog', id)
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
