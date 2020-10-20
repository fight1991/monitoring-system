<template>
  <div class="remote-set">
    <div v-show="tips" class="tips flex-vertical-center">
      <i class="el-icon-warning-outline"></i>
      {{tips}}
    </div>
    <el-form size="mini" style="margin-left:20px" ref="dataForm" :model="dataForm" label-position="right" label-width="260px">
      <el-row class="flex" v-for="(ele) in formItems" :key="ele.key">
        <div class="col-left">
          <!-- input组件 -->
          <template v-if="ele.elemType.uiType === 'input' && ele.level!=2">
            <el-form-item :label="ele.name" :prop="ele.key"
              :rules="rangeValidInput(ele)">
              <el-popover
                popper-class="remote-popper"
                placement="right"
                :disabled="!placeholderText(ele) || ele.level==1"
                trigger="click">
                <span>{{placeholderText(ele)}}</span>
                <el-input slot="reference" v-model="dataForm[ele.key]" :disabled="ele.level==1" :placeholder="placeholderText(ele)"></el-input>
              </el-popover>
            </el-form-item>
          </template>
          <!-- switch组件 -->
          <template v-if="ele.elemType.uiType === 'switch' && ele.level!=2">
            <el-form-item :label="ele.name" :prop="ele.key" :rules="rangeValidSelect(ele)">
              <el-switch
                :disabled="ele.level==1"
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
          <template v-if="ele.elemType.uiType === 'select' && ele.level!=2">
            <el-form-item :label="ele.name" :prop="ele.key" :rules="rangeValidSelect(ele)">
              <el-select v-model="dataForm[ele.key]" remote filterable :disabled="ele.level==1">
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
    <el-row>
      <div style="margin-left: 340px">
        <el-button size="mini" type="primary" @click="saveBtn" v-if="isBlock">{{$t('common.confirm')}}</el-button>
      </div>
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
    tips: {
      default: ''
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
      let { result } = await this.$get({
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
      let { result } = await this.$post({
        url: '/v0/device/setting/set',
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
      return [{ required: true, message: this.messageValid('require'), trigger: 'change' }]
    },
    // 表单校验方法
    rangeValid (rule, value, callback, ele) {
      if (ele.range) {
        let { lo, hi } = ele.range
        let tempVal = Number(value)
        if (isNaN(tempVal) || tempVal < lo || tempVal > hi) {
          let str = lo + '~' + hi
          callback(new Error(this.messageValid('valid') + ' ' + str))
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
          message: this.messageValid('require'),
          trigger: 'blur'
        }, {
          // min: ele.range.lo,
          // max: ele.range.hi,
          validator: (rule, value, callback) => this.rangeValid(rule, value, callback, ele),
          trigger: 'blur'
        }]
      } else {
        return [{ required: true, message: this.messageValid('require'), trigger: 'blur' }]
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
.tips {
  border-radius: 4px 0 0 4px;
  background-color: pink;
  background: repeating-linear-gradient(90deg, #e9ba73, #fff);
  i {
    color: #fff;
    margin: 0 10px;
    font-size: 16px;
  }
}
</style>
