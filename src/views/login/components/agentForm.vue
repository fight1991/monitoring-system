<template>
  <div class="errTip-right">
    <el-row type="flex" style="margin-bottom:15px" justify="center">
      <el-radio-group v-model="agentRadio" size="mini" @change="resetFormValid">
        <el-radio :label="1">{{$t('join.create')}}</el-radio>
        <el-radio :label="2">{{$t('join.join')}}</el-radio>
      </el-radio-group>
    </el-row>
    <el-form size="mini" :model="baseForm" ref="baseForm" label-width="150px" :rules="formRule">
      <!-- 加入代理商 -->
      <el-row v-if="agentRadio==2">
        <el-col :span="24">
          <el-form-item prop="code" :label="$t('user.invCode')">
            <el-input v-model="baseForm.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 创建代理商 -->
      <el-row v-else>
        <el-col :span="24">
          <el-form-item :label="$t('join.companyName')" prop="detail.name">
            <el-input v-model="baseForm.detail.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('plant.country')" prop="detail.country">
            <el-input v-model="baseForm.detail.country"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('plant.address')" prop="detail.address">
            <el-input v-model="baseForm.detail.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('common.postcode')" prop="detail.postcode">
            <el-input v-model="baseForm.detail.postcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.phone')" prop="detail.phone">
            <el-input v-model="baseForm.detail.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('join.remark')">
            <el-input type="textarea" :rows="3" v-model="baseForm.detail.note"></el-input>
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
      agentRadio: 1, // 1 创建 2 加入
      baseForm: {
        code: '',
        detail: {
          name: '',
          country: '',
          address: '',
          phone: '',
          postcode: '',
          note: ''
        }
      },
      formRule: {
        code: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        'detail.name': [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        'detail.country': [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        'detail.address': [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        'detail.phone': [{ pattern: /^$|^\d+$/, message: this.messageValid('valid'), trigger: 'blur' }],
        'detail.postcode': [{ pattern: /^$|^\d+$/, message: this.messageValid('valid'), trigger: 'blur' }],
        'detail.note': [{ message: this.messageValid('require'), trigger: 'blur' }]
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
    },
    resetFormValid () {
      this.$nextTick(() => {
        this.$refs.baseForm.clearValidate()
      })
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
