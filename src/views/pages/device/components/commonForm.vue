<template>
  <div>
    <el-form size="mini" style="margin-left:20px" ref="dataForm" :model="dataForm" label-position="left" label-width="130px">
      <el-row v-for="(ele) in formItems" :key="ele.key">
        <el-col :span="14">
          <!-- input组件 -->
          <template v-if="ele.elemType.uiType === 'input'">
            <el-form-item :label="ele.name" :prop="ele.key"
              :rules="rangeValidInput(ele)">
              <el-input v-model="dataForm[ele.key]" :placeholder="placeholderText(ele)"></el-input>
            </el-form-item>
          </template>
          <!-- switch组件 -->
          <template v-else-if="ele.elemType.uiType === 'switch'">
            <el-form-item :label="ele.name" :prop="ele.key" :rules="rangeValidSelect(ele)">
              <el-switch
                v-model="dataForm[ele.key]"
                active-color="#13ce66"
                active-value="true"
                inactive-value="false"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </template>
          <!-- select组件 -->
          <template v-else>
            <el-form-item :label="ele.name" :prop="ele.key" :rules="rangeValidSelect(ele)">
              <el-select v-model="dataForm[ele.key]" style="width: 100%">
                <el-option v-for="op in ele.elemType.uiItems" :label="op" :key="op" :value="op"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="14" align="center">
        <el-button size="mini" type="primary" @click="saveBtn">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dataForm: {}
    }
  },
  props: {
    formItems: {
      type: Array,
      default () {
        return []
      }
    },
    keyWord: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  created () {},
  methods: {
    // 根据key值查询表单
    async getFormValueByKey (id, key) {
      let { result } = await this.$axios({
        url: '/v0/device/setting/get',
        data: {
          id,
          key
        }
      })
      if (result && result.values) {
        Object.keys(result.values).forEach(key => {
          // this.dataForm[key] = result.values[key]
          this.$set(this.dataForm, key, result.values[key])
        })
      }
    },
    // 保存设置的参数
    async saveBtn () {
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let { result } = await this.$axios({
        url: '/v0/device/setting/set',
        method: 'post',
        data: {
          id: this.id,
          key: this.keyWord,
          values: this.dataForm
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
      }
    },
    // 表单placeHoler
    placeholderText (ele) {
      return ele.range.lo + '~' + ele.range.hi + ' ' + ele.unit
    },
    // 选择框表单校验
    rangeValidSelect (ele) {
      return [{ required: true, message: 'it is required', trigger: 'change' }]
    },
    // 表单校验方法
    rangeValid (rule, value, callback, ele) {
      if (ele.range) {
        let { lo, hi } = ele.range
        let tempVal = Number(value)
        if (isNaN(tempVal) || tempVal < lo || tempVal > hi) {
          let str = lo + '~' + hi
          callback(new Error('it is invalid ' + str))
          return
        }
      }
      callback()
    },
    // input表单校验
    rangeValidInput (ele) {
      if (ele.range && ele.range.enable) {
        return [{
          required: true,
          message: 'it is required',
          trigger: 'blur'
        }, {
          // min: ele.range.lo,
          // max: ele.range.hi,
          validator: (rule, value, callback) => this.rangeValid(rule, value, callback, ele),
          trigger: 'blur'
        }]
      } else {
        return [{ required: true, message: 'it is required', trigger: 'blur' }]
      }
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
