<template>
  <div class="errTip-right">
    <el-form size="mini" :model="baseForm" ref="baseForm" :rules="formRule">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="sn" label="SN">
            <el-input v-model="baseForm.sn" :placeholder="$t('login.tips5')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.code')">
            <el-popover
              :visible-arrow="false"
              trigger="focus"
              popper-class="login-pop"
              width="200"
              placement="right">
              <span>{{$t('login.tips4')}}</span>
              <el-input slot="reference" v-model="baseForm.code"></el-input>
            </el-popover>
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
        sn: '', // 模块sn
        code: '' // 售后组织标识码
      },
      formRule: {
        sn: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }]
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 表单必填项校验及sn合法性校验
    checkForm () {
      let res = false
      this.$refs.baseForm.validate(v => (res = v))
      return res
    },
    // 验证sn是否合法
    async checkSn () {
      let { other } = await this.$post({
        url: '/v0/module/checksn',
        data: {
          type: 0,
          devices: [{ sn: this.baseForm.sn, key: '' }],
          stationID: ''
        }
      })
      return !!other
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
