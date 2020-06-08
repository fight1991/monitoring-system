<template>
  <el-form ref="dataForm" size="mini" :model="dataForm" label-position="left" label-width="140px" :rules="rules">
    <el-row :gutter="20">
      <!-- 安装商/代理商名称 -->
      <el-col :span="12">
        <el-form-item :label="$t('join.companyName')" prop="organName">
          <el-input v-model="dataForm.organName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('plant.country')" prop="details.country" label-width="80px">
          <el-input v-model="dataForm.details.country"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('plant.address')" prop="details.address">
          <el-input v-model="dataForm.details.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('join.email')" prop="details.email">
          <el-input v-model="dataForm.details.email"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('common.postcode')" prop="details.postcode" label-width="80px">
          <el-input v-model="dataForm.details.postcode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('join.phone')" prop="details.phone">
          <div class="flex">
            <el-select v-model="dataForm.details.area" style="width:30%">
              <el-option v-for="item in areaNum" :key="item.num" :label="item.num" :value="item.num"></el-option>
            </el-select>
            <el-input style="width:70%" v-model="dataForm.details.phone" :placeholder="$t('join.phone')"></el-input>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('join.remark')" prop="details.note">
          <el-input type="textarea" :rows="3" v-model="dataForm.details.note"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  data () {
    return {
      dataForm: {
        organName: '',
        details: {
          area: '+86',
          phone: '',
          email: '',
          country: '',
          address: '',
          postcode: '',
          note: ''
        }
      },
      areaNum: [ { num: '+86', contry: 'china' } ],
      rules: {
        organName: [{ required: true, message: '', trigger: 'blur' }],
        'details.country': [{ required: true, message: 'country is required', trigger: 'blur' }],
        'details.address': [{ required: true, message: 'address is required', trigger: 'blur' }]
      }
    }
  },
  props: {
    tag: {
      default: 'agent'
    }
  },
  created () {
    // if (this.tag === 'installer') {
    //   this.getOrgansList('agent')
    // }
  },
  methods: {
    copyForm () {
      return {
        organName: '',
        details: {
          area: '+86',
          phone: '',
          email: '',
          country: '',
          address: '',
          postcode: '',
          note: ''
        }
      }
    },
    cancel () {
      this.dataForm = this.copyForm()
    },
    clearValidate () {
      this.$refs.dataForm.clearValidate()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
