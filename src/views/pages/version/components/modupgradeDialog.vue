<template>
  <el-dialog
    class="sys-dialog"
    :title="'批量升级'"
    :modal-append-to-body="false"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="550px">
    <el-form size="mini" ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="任务名" prop="taskName">
            <el-input v-model="dataForm.taskName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="固件版本" prop="version">
            <el-select v-model="dataForm.version" clearable style="width:100%">
              <el-option v-for="item in versionTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex-center">
      <el-button size="mini" @click="dialogVisible=false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="upgradeBtn">{{'升级'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      versionTypeList: [], // 固件版本
      dataForm: {
        taskName: '',
        version: ''
      },
      rules: {
        taskName: [{ required: true, message: 'it is required', trigger: 'blur' }],
        version: [{ required: true, message: 'it is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  props: ['sns', 'visible'],
  created () {},
  mounted () {},
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
      this.dataForm = {
        taskName: '',
        version: ''
      }
      this.$refs.dataForm.clearValidate()
    },
    async upgradeBtn () {
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let { result } = await this.$axios({
        url: '/v0/firmware/module/upgrade',
        data: {
          ...this.dataForm,
          modules: this.sns
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.dialogVisible = false
      }
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.flex-center {
  margin-top: 10px;
}
</style>
