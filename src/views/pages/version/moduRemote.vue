<template>
  <section class="sys-main">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.version" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.version" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" clearable v-model="searchForm.status" :placeholder="$t('plant.equipSta')">
                  <el-option v-for="(item,index) in statusList" :label="item" :value="item" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" clearable v-model="searchForm.status" :placeholder="$t('plant.datacolType')">
                  <el-option v-for="(item,index) in statusList" :label="item" :value="item" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.version" clearable :placeholder="$t('invupgrade.dataversion')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-button size="mini" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button type="primary" size="mini" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-shengji">{{$t('invupgrade.upgrade')}}</el-button>
          <el-button size="mini" icon="iconfont icon-chakan">{{$t('invupgrade.upstatus')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" @select="getSelection" :selectBox="true" :height="530" :tableList="resultList">
          <template v-slot:time="{row}">
            {{Number(row.time )| formatDate('yyyy-MM-dd')}}
          </template>
        </common-table>
        <div class="states-row">
          <span><i class="el-icon-success"></i> {{$t('common.online')}}</span>
          <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
        </div>
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </func-bar>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {},
      versionList: [], // 版本类型
      typeList: [], // 设备类型
      statusList: [], // 审核状态
      resultList: [],
      selection: [],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'common.plant',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.datacolSN',
          prop: 'type',
          checked: true,
          width: 130
        },
        {
          label: 'plant.datacolType',
          prop: 'type',
          checked: true,
          width: 130,
          renderHeader: true
        },
        {
          label: 'invupgrade.dataversion',
          prop: 'type',
          checked: true,
          width: 130,
          renderHeader: true
        },
        {
          label: 'common.invertSn',
          prop: 'time',
          checked: true,
          width: 110
        },
        {
          label: 'invupgrade.invmodel',
          prop: 'time',
          checked: true,
          width: 120
        },
        {
          label: 'invupgrade.datastatus',
          prop: 'time',
          checked: true,
          slotName: 'status',
          fixed: 'right',
          renderHeader: true
        }
      ]
    }
  },
  methods: {
    reset () {
      this.searchForm = {}
    },
    search () {

    },
    getSelection (select) {
      this.selection = []
    },
    // 获取列表
    async getList (pagination) {
      let { result } = await this.$axios({
        url: '/v0/module/list',
        method: 'post',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.resultList = result.data || []
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
