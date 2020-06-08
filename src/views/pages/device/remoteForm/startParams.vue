<template>
  <div class="form-area">
    <el-form :model="dataForm" style="margin-left:20px" label-position="left" size="mini" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="启动连接时间(S)">
            <el-input v-model="dataForm.aa" placeholder="15~300"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="启动加载速率(%/min)">
            <el-input v-model="dataForm.aa" placeholder="0~100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="重连时间(S)">
            <el-input v-model="dataForm.aa" placeholder="0~60000"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="重连加载速率(%/min)">
            <el-input v-model="dataForm.aa" placeholder="0~100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电压上限(V)">
            <el-input v-model="dataForm.aa" placeholder="200~300"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电压下限(V)">
            <el-input v-model="dataForm.aa" placeholder="50~220"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="频率上限(Hz)">
            <el-input v-model="dataForm.aa" placeholder="45~65"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="频率下限(Hz)">
            <el-input v-model="dataForm.aa" placeholder="45~65"></el-input>
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
