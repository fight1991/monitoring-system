<template>
  <section class="sys-main bg-c">
    <div class="remote-set-tab">
      <el-tabs type="card" tab-position="left" v-model="tabName">
        <el-tab-pane :label="item.label" v-for="item in tabList" :key="item.id" :name="item.id">
          <component :is="item.component"></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import baseForm from './remoteForm/baseForm'
import hightForm from './remoteForm/highForm'
import startParams from './remoteForm/startParams'

export default {
  components: {
    baseForm,
    hightForm,
    startParams
  },
  data () {
    return {
      tabName: '1',
      tabList: [
        {
          id: '1',
          label: '基本配置',
          component: 'baseForm'
        },
        {
          id: '2',
          label: '高级配置',
          component: 'hightForm'
        },
        {
          id: '3',
          label: '启动参数',
          component: 'startParams'
        },
        {
          id: '4',
          label: '电网电压',
          component: 'baseForm'
        },
        {
          id: '5',
          label: '电网频率',
          component: 'baseForm'
        },
        {
          id: '6',
          label: '过频降载',
          component: 'baseForm'
        },
        {
          id: '7',
          label: '无功参数',
          component: 'baseForm'
        },
        {
          id: '8',
          label: 'DCI配置',
          component: 'baseForm'
        },
        {
          id: '9',
          label: '有功参数',
          component: 'baseForm'
        },
        {
          id: '10',
          label: 'AC过压降载',
          component: 'baseForm'
        },
        {
          id: '11',
          label: '电表参数',
          component: 'baseForm'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.remote-set-tab {
  padding: 30px 40px;
}
</style>
