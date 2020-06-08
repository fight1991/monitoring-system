<template>
  <el-dialog
    class="sys-dialog"
    :title="title"
    :modal-append-to-body="false"
    @opened="cancelForm"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="700px">
    <div class="content">
      <create-form ref="form" :tag="$attrs.tag" :organList="organList"></create-form>
    </div>
    <div class="foot-btn flex-center">
      <el-button size="mini" @click="cancelBtn">{{$t('common.cancel')}}</el-button>
      <el-button size="mini" type="primary" @click="register">{{$t('common.register')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import createForm from './component/createForm'
export default {
  components: {
    createForm
  },
  data () {
    return {
      dialogVisible: false,
      accessInfo: {
        user: 1,
        installer: 2,
        agent: 3
      }
    }
  },
  props: {
    visible: {
      default: false
    },
    title: {
      default: ''
    },
    organList: {
      default () {
        return []
      }
    }
  },
  watch: {
    visible: function (newData) {
      this.dialogVisible = newData
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:visible', false)
    },
    cancelBtn () {
      this.cancelForm()
      this.dialogVisible = false
    },
    cancelForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.cancel()
    },
    // 创建 代理商
    register () {
      let flag = true
      this.$refs.form.$refs.dataForm.validate(valid => {
        flag = valid
      })
      if (!flag) return
      let submitData = JSON.parse(JSON.stringify(this.$refs.form.dataForm))
      let phone = submitData.details.area + '-' + submitData.details.phone
      submitData.details.phone = phone
      this.$post({
        url: '/v0/organs/register',
        data: submitData,
        success: res => {
          let access = this.accessInfo[this.$attrs.tag]
          this.$store.commit('setAccess', access)
          this.$message.success(this.$t('join.joinTips'))
          this.dialogVisible = false
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
