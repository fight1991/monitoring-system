<template>
  <section class="sys-main bg-c" v-setH:min="setDivH">
    <div class="remote-set-tab">
      <el-tabs type="card" tab-position="left" v-model="tabName" @tab-click="tabClickBtn">
        <el-tab-pane v-for="item in tabList" :key="item.key" :label="item.name" :name="item.key">
          <common-form :ref="'form'+item.key" :formItems="item.properties" :keyWord="item.key" :id="id"></common-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import commonForm from './components/commonForm'
export default {
  components: { commonForm },
  data () {
    return {
      id: '',
      tabName: '',
      tabList: []
    }
  },
  async created () {
    this.id = this.$route.query.id
    await this.getTabList()
    if (this.tabList.length > 0) {
      this.tabName = this.tabList[0].key
      // 初始化默认tabName下的表单数据
      this.$nextTick(() => {
        // 在v-for下绑定ref返回的是一个数组
        let tempDom = this.$refs['form' + this.tabName]
        if (tempDom && tempDom.length > 0) {
          let $commonForm = this.$refs['form' + this.tabName][0]
          $commonForm.getFormValueByKey(this.id, this.tabName)
        }
      })
    }
  },
  async mounted () {},
  methods: {
    // 获取tab结构
    async getTabList () {
      let { result } = await this.$axios({
        url: '/v0/device/setting/ui',
        data: {
          id: this.id
        }
      })
      if (result && result.parameters) {
        this.tabList = result.parameters
      }
      return true
    },
    // 点击tab
    tabClickBtn ({ name }) {
      this.$nextTick(() => {
        this.$refs['form' + name][0].getFormValueByKey(this.id, name)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.remote-set-tab {
  padding: 30px 0 30px 30px;
}
</style>
