<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.inver" placeholder="逆变器sn" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.modu" placeholder="模块sn" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.plant" placeholder="电站" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.status" placeholder="设备状态" clearable>
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.inverType" placeholder="逆变器类型" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduType" placeholder="模块类型" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.inverVer" placeholder="逆变器软件版本" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">m
              <el-form-item>
                <el-input v-model="searchForm.moduVer" placeholder="模块软件版本" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-form-item>
                <el-button size="mini" @click="reset">清空</el-button>
                <el-button type="primary" size="mini" @click="search">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-form></el-form>
      </func-bar>
    </div>
    <div class="page-list">
      <page-box :pagination.sync="pagination" @change="getList"></page-box>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {
        inver: '',
        modu: '',
        plant: '',
        status: '',
        inverType: '',
        moduType: '',
        inverVer: '',
        moduVer: ''
      },
      options: [
        {
          value: '1',
          label: '在线'
        },
        {
          value: '2',
          label: '离线'
        }
      ],
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  methods: {
    reset () {
      this.searchForm = {
        inver: '',
        modu: '',
        plant: '',
        status: '',
        inverType: '',
        moduType: '',
        inverVer: '',
        moduVer: ''
      }
    },
    search () {},
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
