<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('invupgrade.status')"
    :modal-append-to-body="false"
    @open="search"
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
import * as eventBus from '../common/eventBus'
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      resultList: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'invupgrade.taskName',
          prop: 'taskName',
          checked: true
        }, {
          label: 'invupgrade.total',
          prop: 'total',
          checked: true
        }, {
          label: 'invupgrade.completed',
          prop: 'upgraded',
          checked: true
        }, {
          label: 'invupgrade.upgrading',
          prop: 'upgrading',
          checked: true
        }, {
          label: 'invupgrade.failed',
          prop: 'failed',
          checked: true
        }, {
          label: 'common.time',
          prop: 'time',
          checked: true
        }, {
          label: 'common.operation',
          prop: 'op',
          slotName: 'op',
          checked: true
        }
      ]
    }
  },
  props: ['visible', 'apiUrl'],
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  created () {},
  mounted () {},
  methods: {
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/firmware/' + this.apiUrl + '/upgrade/status',
        globalLoading: true,
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
      eventBus[this.apiUrl].$emit('openUpdetailDialog', id)
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
