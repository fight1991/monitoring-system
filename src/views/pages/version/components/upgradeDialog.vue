<template>
  <el-dialog
    class="sys-dialog"
    :title="$t('invupgrade.upgrade')"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
    @open="getVersionInfo"
    :visible.sync="dialogVisible"
    width="600px">
    <el-form size="mini" ref="dataForm" :model="dataForm" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('invupgrade.taskName')" prop="taskName">
            <el-input v-model="dataForm.taskName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('firmware.SoftType')" prop="softType">
            <el-select v-model="dataForm.softType" clearable style="width:100%" @change="softTypeChange">
              <el-option v-for="item in solfTypeList" :label="item" :value="item" :key="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('invupgrade.version')" prop="id">
            <el-select v-model="dataForm.id" clearable style="width:100%" remote filterable>
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
          <el-form-item :label="$t('common.timeout')">
            <el-input v-model.number="dataForm.timeout">
              <span slot="suffix">min</span>
            </el-input>
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
      <el-button type="primary" size="mini" @click="upgradeBtn">{{$t('common.upgrade')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dialogVisible: false,
      typeList: [],
      dataForm: {
        taskName: '',
        softType: '',
        id: '',
        timeout: 15
      },
      versionInfo: {},
      rules: {
        taskName: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        softType: [{ required: true, message: this.messageValid('require'), trigger: 'change' }],
        id: [{ required: true, message: this.messageValid('require'), trigger: 'change' }],
        timeout: [
          { type: 'number', min: 3, max: 40, message: this.messageValid('valid') + ' 5 ~ 40min', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  props: ['sns', 'visible', 'type'],
  created () {},
  computed: {
    solfVersionList () {
      return this.versionInfo[this.dataForm.softType] || []
    },
    solfTypeList () { // 软件类别
      if (this.type === 'device') {
        return ['master', 'slave', 'manager']
      } else {
        return ['wifi', 'gprs', 'lan']
      }
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
        softType: '',
        id: '',
        timeout: 15
      }
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    async upgradeBtn () {
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let params = {}
      if (this.type === 'device') {
        params.devices = this.sns
      } else {
        params.modules = this.sns
      }
      let { result } = await this.$post({
        url: `/v0/firmware/${this.type}/upgrade`,
        globalLoading: true,
        data: {
          ...this.dataForm,
          ...params
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
      let { result } = await this.$get({
        url: `/v0/firmware/${this.type}/version`,
        globalLoading: true
      })
      if (result) {
        this.versionInfo = result
      }
    },
    softTypeChange (val) {
      this.dataForm.id = ''
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
