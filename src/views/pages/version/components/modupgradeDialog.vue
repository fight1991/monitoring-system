<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('invupgrade.upgrade')"
    :modal-append-to-body="false"
    @close="closeDialog"
    @open="getVersionInfo"
    :visible.sync="dialogVisible"
    width="550px">
    <el-form size="mini" ref="dataForm" :model="dataForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('invupgrade.taskName')" prop="taskName">
            <el-input v-model="dataForm.taskName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('firmware.SoftType')" prop="softType">
            <el-select v-model="dataForm.softType" clearable style="width:100%">
              <el-option v-for="item in solfTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('invupgrade.version')" prop="id">
            <el-select v-model="dataForm.id" clearable style="width:100%">
              <el-option v-for="item in solfVersionList" :label="item.version" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('firmware.firmwareName')">
            <el-input v-model="nameNote.name" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.remark')">
            <el-input v-model="nameNote.note" readonly></el-input>
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
      solfTypeList: ['wifi', 'gprs', 'lan'], // 软件类别
      versionTypeList: [], // 软件版本
      dataForm: {
        taskName: '',
        id: '',
        softType: ''
      },
      versionInfo: {},
      rules: {
        taskName: [{ required: true, message: 'it is required', trigger: 'blur' }]
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
  computed: {
    solfVersionList () {
      return this.versionInfo[this.dataForm.softType] || []
    },
    nameNote () {
      let obj = { name: '', note: '' }
      if (this.solfVersionList && this.solfVersionList.length > 0) {
        let tempInfo = this.solfVersionList.find(v => v.id === this.dataForm.id)
        if (tempInfo) {
          obj.name = tempInfo.name
          obj.note = tempInfo.note
        }
      }
      return obj
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
      this.dataForm = {
        taskName: '',
        version: ''
      }
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    async upgradeBtn () {
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let { result } = await this.$axios({
        url: '/v0/firmware/module/upgrade',
        method: 'post',
        globalLoading: true,
        data: {
          ...this.dataForm,
          modules: this.sns
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.dialogVisible = false
        this.$emit('refreshList')
      }
    },
    // 获取固件版本信息
    async getVersionInfo () {
      let { result } = await this.$axios({
        url: '/v0/firmware/module/version',
        globalLoading: true
      })
      if (result) {
        this.versionInfo = result
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
