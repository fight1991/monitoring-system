<template>
  <el-dialog
    :title="'批量下载'"
    :modal-append-to-body="false"
    @closed="$emit('update:visible', false)"
    :visible.sync="dialogVisible">
    <div class="up-box">
      <el-row>
        <el-button size="mini" type="primary" icon="el-icon-download">模板下载</el-button>
      </el-row>
      <el-upload
        :show-file-list="true"
        :file-list="fileList"
        :http-request="beforeUpload"
        action="http://127.0.0.1">
        <el-row class="btn">
          <el-button size="mini" type="success" icon="el-icon-upload">导入模板</el-button>
        </el-row>
        <div slot="tip" class="el-upload__tip">只能上传xls, xlsx文件</div>
      </el-upload>
    </div>
    <el-row type="flex" justify="center">
      <el-button size="mini">取消</el-button>
      <el-button size="mini" type="primary">下载</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { readExcel } from '@/util'
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      fileList: []
    }
  },
  props: {
    visible: {
      default: false
    }
  },
  created () {},
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  methods: {
    // 读取文件信息
    async beforeUpload ({ file }) {
      // excel格式
      this.fileList = [{ name: file.name }]
      let excelType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!excelType.includes(file.type)) {
        this.$message({
          message: 'invalid file type',
          type: 'error'
        })
        return false
      }
      // 批量下载api
      // 电脑excel文件被加密,导致读取乱码
      readExcel(file)
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.up-box {
  padding: 0 20px;
  height: 160px;
}
.btn {
  margin-top: 20px;
}
</style>
