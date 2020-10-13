<template>
<div style="height:100%" :class="{'fullScreen':isFullScreen}" ref="fullScreen">
  <div class="tab-container">
    <el-tabs v-model="$store.state.tab.currentTab" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <template v-for="(item, index) in tabList">
        <el-tab-pane
          :closable="index > 0"
          :key="item.name + item.tabId"
          :name="item.name">

          <!-- 页签区域开始 -->
          <span slot="label" v-show="index==0"><i class="iconfont icon-home"></i></span>
          <span slot="label" v-show="index > 0">{{$t('navBar.'+item.title)}}</span>
          <!-- 页签切换太快出现popper位置错乱问题 -->
          <!-- <el-popover
            popper-class="tab-popper"
            width="100%"
            slot="label"
            placement="bottom"
            trigger="hover">
            <span slot="reference" v-show="index > 0">{{$t('navBar.'+item.title)}}</span>
            <div class="tab-refresh" @click="reload(item)"><i class="el-icon-refresh"></i>{{$t('common.refresh')}}</div>
          </el-popover> -->
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
          <el-dropdown-item :command="1">{{$t('common.closeAll')}}</el-dropdown-item>
          <el-dropdown-item :command="2">{{$t('common.closeOther')}}</el-dropdown-item>
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
      currentTab: state => state.tab.currentTab,
      loading: state => state.loading
    })
  },
  created () {},
  methods: {
    reload (item) {
      let tabInfo = item || this.$store.getters.currentTabInfo
      if (!tabInfo.isShow || tabInfo.loadingNum > 0) return // 节流
      tabInfo.isShow = false
      this.$nextTick(() => {
        tabInfo.isShow = true
      })
    },
    tabClick (tabInfo) {
      // tabInfo tab实例, .name得到tabId
      let { name, query, params } = this.tabList.find(v => v.name === tabInfo.name)
      if (name === this.$route.name) return
      this.$router.push({
        name,
        query,
        params
      })
    },
    removeTab (name) {
      if (name === this.currentTab) {
        this.$tab.closeActiveTab(name)
      } else {
        this.$tab.closeInactiveTab(name)
      }
    },
    closeTab (type) {
      if (type === 1) {
        this.$tab.closeAllTab()
      } else {
        this.$tab.closeOtherTab()
      }
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 30px;
    overflow: hidden;
    border-left: 1px solid #E4E7ED;
    line-height: 30px;
    // text-align: center;
    position: absolute;
    z-index: 5;
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
