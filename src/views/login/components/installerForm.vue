<template>
  <div class="errTip-right">
    <el-form size="mini" :model="baseForm" ref="baseForm" :rules="formRule">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="name" :label="$t('join.installer')">
            <el-input v-model="baseForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.agentCode')">
            <el-input v-model="baseForm.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.phone')" prop="phone">
            <el-input v-model="baseForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      baseForm: {
        name: '',
        code: '',
        phone: ''
      },
      formRule: {
        name: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        phone: [{ pattern: /^$|^\d+$/, message: this.messageValid('valid'), trigger: 'blur' }]
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 表单必填项校验及sn合法性校验
    async checkForm () {
      let res = await this.$refs.baseForm.validate().then(v => v).catch(v => v)
      return res
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
