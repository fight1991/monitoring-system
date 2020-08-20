<template>
  <div class="remote-set">
    <el-form size="mini" style="margin-left:20px" ref="dataForm" :model="dataForm" label-position="left" label-width="200px">
      <el-row class="flex" v-for="(ele) in formItems" :key="ele.key">
        <div class="col-left">
          <!-- input组件 -->
          <template v-if="ele.elemType.uiType === 'input'">
            <el-form-item :label="ele.name" :prop="ele.key"
              :rules="rangeValidInput(ele)">
              <el-popover
                popper-class="remote-popper"
                placement="right"
                trigger="click">
                <span>{{placeholderText(ele)}}</span>
                <el-input slot="reference" v-model="dataForm[ele.key]" :placeholder="placeholderText(ele)"></el-input>
              </el-popover>
            </el-form-item>
          </template>
          <!-- switch组件 -->
          <template v-else-if="ele.elemType.uiType === 'switch'">
            <el-form-item :label="ele.name" :prop="ele.key" :rules="rangeValidSelect(ele)">
              <el-switch
                @change="singleBtn(ele.key, 'switch')"
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
        </div>
        <div class="col-right" v-show="!isBlock && ele.elemType.uiType!='switch'">
          <el-button type="success" size="mini" icon="iconfont icon-carry-out" circle @click="singleBtn(ele.key)"></el-button>
        </div>
      </el-row>
    </el-form>
    <el-row style="width:350px">
      <el-col align="center">
        <el-button size="mini" type="primary" @click="saveBtn" v-if="isBlock">{{$t('common.confirm')}}</el-button>
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
    isBlock: { // 整体提交或单条提交
      type: Boolean,
      default: true
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
    // 单条编辑
    singleBtn (key, uiType) {
      if (this.isBlock) return
      let tempForm = {}
      tempForm[key] = this.dataForm[key]
      if (uiType) {
        this.submitForm(key, tempForm)
        return
      }
      this.$refs.dataForm.validateField(key, (err) => {
        if (!err) { // 校验通过
          this.submitForm(key, tempForm)
        }
      })
    },
    // 整体提交保存设置的参数
    saveBtn () {
      let flag = true
      this.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      this.submitForm()
    },
    // 表单提交api
    async submitForm (key, form) {
      let { result } = await this.$axios({
        url: '/v0/device/setting/set',
        method: 'post',
        data: {
          id: this.id,
          key: key || this.keyWord,
          values: form || this.dataForm
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        if (key) {
          this.getFormValueByKey(this.id, this.keyWord)
        }
      }
    },
    // 表单placeHoler
    placeholderText (ele) {
      if (ele.range) {
        return ele.range.lo + '~' + ele.range.hi + ' ' + ele.unit
      }
      return ''
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
.col-right {
  margin-left: 10px;
}
</style>
