<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('battRemote.batInfo')"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="80%">
    <div class="container flex-column-between" v-setH:min="setDivH-250">
      <func-bar>
        <common-table :tableHeadData="tableHead" :tableList="list">
        </common-table>
      </func-bar>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
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
  props: [ 'visible', 'list' ],
  mounted () {},
  watch: {
    visible: function (newData) {
      console.log(newData)
      this.dialogVisible = newData
    }
  },
  methods: {
    // 关闭对话框
    closeDialog () {
      this.$emit('update:visible', false)
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
