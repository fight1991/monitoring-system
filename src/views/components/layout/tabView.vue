<template>
<div style="height:100%" :class="{'fullScreen':isFullScreen}" ref="fullScreen">
  <div class="tab-container">
    <el-tabs v-model="$store.state.tab.currentTab" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <template v-for="(item, index) in tabList">
        <el-tab-pane
          :closable="index > 0"
          :key="item.tabId"
          :name="item.tabId">

          <!-- 页签区域开始 -->
          <span slot="label" v-if="index==0"><i class="iconfont icon-home"></i></span>
          <el-popover
            popper-class="tab-popper"
            width="100%"
            slot="label"
            placement="bottom"
            trigger="hover">
            <span slot="reference" v-if="index > 0">{{$t('navBar.'+item.title)}}</span>
            <div class="tab-refresh" @click="reload(item)"><i class="el-icon-refresh"></i>{{$t('common.refresh')}}</div>
          </el-popover>
          <!-- 页签区域结束 -->

          <!-- 组件内容区域开始 -->
          <el-scrollbar wrap-class="tab-scrollbar-wrapper" v-loading="item.loadingNum > 0">
            <div class="tab-content" v-if="item.isShow">
              <component :is="item.components[item.components.length-1]"></component>
              <div v-show="index>0" class="copy-right" v-text="$store.state.rightsTxt + $t('login.allRight')"></div>
            </div>
          </el-scrollbar>
          <!-- 组件内容区域结束 -->

        </el-tab-pane>
      </template>
    </el-tabs>
    <div class="tab-right">
      <el-dropdown trigger="click" @command="closeTab">
        <span class="el-dropdown-link">
          <i class="iconfont icon-caidan" :title="$t('common.tabOp')"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="closeAllTab">{{$t('common.closeAll')}}</el-dropdown-item>
          <el-dropdown-item command="closeOtherTab">{{$t('common.closeOther')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'tab-view',
  data () {
    return {
      isFullScreen: false
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  computed: {
    ...mapState({
      tabList: state => state.tab.tabList,
      loading: state => state.loading
    })
  },
  created () {},
  methods: {
    reload (item) {
      let currentTab = item || this.$store.getters.currentTabInfo
      if (!currentTab.isShow || this.loading) return // 节流
      currentTab.isShow = false
      this.$nextTick(() => {
        currentTab.isShow = true
      })
    },
    tabClick (tabInfo) {
      let { path, query, params } = this.tabList.find(v => v.tabId === tabInfo.name)
      if (path === this.$route.path) return
      // if (tabInfo.name === 'tab-index') {
      //   this.$store.commit('setCurrentTab', 'tab-index')
      //   return
      // }
      // 路由跳转
      this.$router.push({
        path,
        query,
        params
      })
    },
    removeTab (name) {
      this.$store.commit('closeTab', name)
    },
    closeTab (type) {
      this.$store.dispatch(type)
    }
  }
}
</script>
<style lang="less" scoped>
.tab-refresh {
  text-align: center;
  cursor: pointer;
  .el-icon-refresh {
    margin-right: 4px;
  }
  font-size: 12px;
  &:hover {
    background-color: #f5f5f5;
    color: @sys-main-header;
  }
}
.el-dropdown-link i{
  cursor: pointer;
  font-size: 20px;
  line-height: 35px;
}
.el-icon-s-home {
  font-size: 20px;
  line-height: 30px;
}
.fullScreen {
  background-color: #f5f5f5;
}
.tab-container {
  position: relative;
  .tab-right {
    width: 40px;
    border-left: 1px solid #E4E7ED;
    line-height: 30px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
  }
}
.copy-right {
  font-size: 12px;
  color: #ccc;
  margin-top: 10px;
  text-align: center;
  height: 16px;
}
</style>
