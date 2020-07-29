<template>
  <el-dialog
    class="sys-dialog"
    :title="'导入'"
    :modal-append-to-body="false"
    @close="closeDialog"
    @open="getProductList"
    :visible.sync="dialogVisible"
    width="550px">
    <div class="content">
      <el-row class="select-file flex">
        <el-upload
          :auto-upload="false"
          :show-file-list="false"
          :on-change="beforeUpload"
          action="http://127.0.0.1">
          <el-row class="btn">
            <el-button size="mini" type="primary">选择文件</el-button>
          </el-row>
          <div slot="tip" class="el-upload__tip">注: 只能上传hex, bin文件</div>
        </el-upload>
        <div class="file-name">{{fileList && fileList[0] && fileList[0].name}}</div>
      </el-row>
      <el-form size="mini" ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="固件名称" prop="firmwareName">
              <el-input v-model="dataForm.firmwareName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="文件类型" prop="fileType">
              <el-select v-model="dataForm.fileType" clearable style="width:100%">
                <el-option v-for="item in fileTypeList" :label="item" :value="item" :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="固件版本" prop="firmwareVersion">
              <el-input v-model="dataForm.firmwareVersion" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="设备类别" prop="modelType">
              <el-select v-model="dataForm.modelType" clearable style="width:100%" @change="modelTypeChange">
                <el-option v-for="item in deviceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="产品系列" prop="productType">
              <el-select v-model="dataForm.productType" clearable style="width:100%" multiple>
                <el-option v-for="item in productTypeList" :label="item" :value="item" :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="软件类别" prop="softType" :rules="{ required: dataForm.modelType==1, message: 'it is required', trigger: 'change' }">
              <el-select v-model="dataForm.softType" :disabled="dataForm.modelType!=1" clearable style="width:100%">
                <el-option v-for="item in softTypeList" :label="item" :value="item" :key="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input type="textarea" clearable v-model="dataForm.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="foot-btn flex-center">
      <el-button size="mini" @click="dialogVisible=false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" size="mini" @click="confirmBtn">{{$t('common.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getFileMd5 } from '@/util'
export default {
  data () {
    return {
      dialogVisible: false,
      fileList: [],
      dataForm: {
        firmwareName: '',
        fileType: '',
        firmwareVersion: '',
        modelType: '',
        productType: [],
        softType: '',
        note: ''
      },
      fileTypeList: ['hex', 'bin'],
      softTypeList: [ // 软件类别
        'master',
        'slave',
        'manager'
      ],
      deviceTypeList: [ // 设备类型
        { label: '逆变器', value: 1 },
        { label: '模块', value: 2 },
        { label: '电池', value: 3 }
      ],
      allList: [],
      rules: {
        firmwareName: [{ required: true, message: 'it is required', trigger: 'blur' }],
        fileType: [{ required: true, message: 'it is required', trigger: 'change' }],
        firmwareVersion: [{ required: true, message: 'it is required', trigger: 'blur' }],
        modelType: [{ required: true, message: 'it is required', trigger: 'change' }],
        productType: [{ required: true, message: 'it is required', trigger: 'change' }]
      }
    }
  },
  props: {
    visible: {
      default: false
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  computed: {
    productTypeList () {
      let tempList = this.allList.find(v => v.modelType === this.dataForm.modelType)
      if (tempList) {
        return tempList.productType
      }
      return []
    }
  },
  created () {},
  mounted () {},
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
      this.fileList = []
      this.dataForm = {
        firmwareName: '',
        fileType: '',
        firmwareVersion: '',
        modelType: '',
        productType: [],
        softType: '',
        note: ''
      }
      this.$refs.dataForm.clearValidate()
    },
    // 获取产品型号
    async getProductList () {
      let { result } = await this.$axios({
        url: '/v0/firmware/products',
        globalLoading: true
      })
      if (result) {
        this.allList = result
      }
    },
    // 上传固件包api
    uploadFirmware (formData) {
      this.$upload({
        url: '/v0/firmware/upload',
        data: formData,
        globalLoading: true,
        success: res => {
          this.$message.success(this.$t('common.success'))
          this.dialogVisible = false
          this.$emit('refreshList')
        }
      })
    },
    // 读取文件信息
    beforeUpload (file) {
      this.fileList = [file]
    },
    // 点击确认按钮
    async confirmBtn () {
      if (this.fileList.length !== 1) {
        this.$message.error('请选择文件')
        return
      }
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let fileInfo = this.fileList[0].raw
      let fileMd5 = await getFileMd5(fileInfo)
      let formData = new FormData()
      formData.append('upfile', fileInfo)
      formData.append('md5', fileMd5)
      let tempForm = JSON.parse(JSON.stringify(this.dataForm))
      tempForm.productType = tempForm.productType.join()
      Object.keys(tempForm).forEach(v => {
        formData.append(v, tempForm[v])
      })
      this.uploadFirmware(formData)
    },
    // 设备类别change事件
    modelTypeChange () {
      this.dataForm.softType = ''
      this.dataForm.productType = []
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.select-file {
  padding-bottom: 10px;
  padding-left: 35px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}
</style>
