<template>
  <el-dialog
    :title="title"
    :modal-append-to-body="false"
    @opened="cancelForm"
    @close="closeDialog"
    :visible.sync="dialogVisible"
    width="600px">
    <div class="form-content">
      <join-form ref="form" :tag="$attrs.tag" :organList="organList"></join-form>
    </div>
    <div class="foot-btn flex-center">
      <el-button size="mini" @click="cancelForm">{{$t('common.cancel')}}</el-button>
      <el-button size="mini" type="primary" @click="joinSome">{{$t('common.register')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import joinForm from './component/joinForm'
export default {
  components: {
    joinForm
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
      this.dialogVisible = false
      this.cancelForm()
    },
    cancelForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.cancel()
    },
    // 加入成为安装商,加入代理商, 创建终端用户
    joinSome () {
      let flag = true
      this.$refs.form.$refs.dataForm.validate(valid => (flag = valid))
      if (!flag) return
      let { organNameS, organNameM, moduleSN } = this.$refs.form.dataForm
      let tempData = {
        moduleSN: '',
        organName: [],
        organType: ''
      }
      tempData.organType = this.$attrs.tag
      if (this.$attrs.tag === 'user') {
        tempData.moduleSN = moduleSN
      }
      if (this.$attrs.tag === 'installer') {
        tempData.organName = organNameM
      }
      if (this.$attrs.tag === 'agent') {
        tempData.organName = organNameS
      }
      this.$post({
        url: '/v0/organs/join',
        data: tempData,
        success: res => {
          let access = this.access[this.$attrs.tag]
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
.form-content {
  height: 200px;
  // padding: 10px 10px 50px;
}
</style>
