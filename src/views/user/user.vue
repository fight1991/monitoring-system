<template>
  <section class='user-container'>
    <div class="content-box">
      <el-row class="top">
        <el-page-header @back="$router.go(-1)" content=""></el-page-header>
      </el-row>
      <el-row class="bottom">
        <div class="nav-bar">
          <el-menu
            @select="(index)=>componentId=index"
            :default-active="componentId">
            <el-menu-item index="user-info">
              <i class="iconfont icon-person-info"></i>
              <span slot="title">{{$t('user.info')}}</span>
            </el-menu-item>
            <el-menu-item index="account">
              <i class="iconfont icon-account-set"></i>
              <span slot="title">{{$t('user.account')}}</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="nav-content bg-c">
          <keep-alive>
            <component :is="componentId"></component>
          </keep-alive>
        </div>
      </el-row>
    </div>
  </section>
</template>

<script>
import userInfo from './components/userInfo'
import account from './components/accountSet'
export default {
  components: { userInfo, account },
  data () {
    return {
      componentId: 'user-info'
    }
  },
  created () {},
  mounted () {},
  methods: {

  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.user-container {
  width: 100%;
  height: 100%;
  background-color: #e5f2ff;
}
.content-box {
  height: 100%;
  width: 90%;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .top {
    margin: 10px 0 5px 10px;
  }
  .bottom {
    flex: 1;
    display: flex;
    margin-bottom: 30px;
    .nav-bar {
      width: 150px;
      margin-right: 20px;
    }
    .nav-content {
      flex: 1;
      padding: 20px;
    }
  }
}
.iconfont {
  margin-right: 8px;
}
</style>
