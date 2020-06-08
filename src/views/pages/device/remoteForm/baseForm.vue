<template>
  <div class="form-area">
    <el-form :model="dataForm" style="margin-left:20px" label-position="left" size="mini" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="语言">
            <el-select v-model="dataForm.aa" style="width:100%">
              <el-option label="English" value="en" key="en"></el-option>
              <el-option label="中文" value="zh" key="zh"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="安装类型">
            <el-select v-model="dataForm.aa" style="width:100%">
              <el-option label="English" value="en" key="en"></el-option>
              <el-option label="中文" value="zh" key="zh"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Modbus地址">
            <el-input v-model="dataForm.aa"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工厂模式">
            <el-select v-model="dataForm.aa" style="width:100%">
              <el-option label="English" value="en" key="en"></el-option>
              <el-option label="中文" value="zh" key="zh"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="pv输入模式">
            <el-select v-model="dataForm.aa" style="width:100%">
              <el-option label="English" value="en" key="en"></el-option>
              <el-option label="中文" value="zh" key="zh"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="DRM enable">
            <el-switch
              v-model="dataForm.aa"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="100"
              inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Mute enable">
            <el-switch
              v-model="dataForm.aa"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="100"
              inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="DI ON/OFF enable">
            <el-switch
              v-model="dataForm.aa"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="100"
              inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="12" align="center">
        <el-button size="mini" type="primary">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataForm: {
        aa: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
