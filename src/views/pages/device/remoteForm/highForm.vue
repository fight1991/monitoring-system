<template>
  <div class="form-area">
    <el-form :model="dataForm" style="margin-left:20px" label-position="left" size="mini" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="清除当日发电量">
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
          <el-form-item label="清除总发电量">
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
          <el-form-item label="清除事件列表">
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
          <el-form-item label="远程关机">
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
          <el-form-item label="写入当日发电量">
            <el-input v-model="dataForm.aa" placeholder="kwh"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="写入总发电量">
            <el-input v-model="dataForm.aa" placeholder="kwh"></el-input>
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
