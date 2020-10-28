<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.plantName" clearable :placeholder="$t('common.plant')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="searchForm.deviceSN" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="showHsearch">
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterSN" clearable :placeholder="$t('battRemote.bmsMasterSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="searchForm.bmsMasterVersion" clearable :placeholder="$t('battRemote.bmsMasterVersion')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveSN" clearable :placeholder="$t('battRemote.bmsSlaveSN')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                    <el-input v-model="searchForm.bmsSlaveVersion" clearable :placeholder="$t('battRemote.bmsSlaveVersion')"></el-input>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6" align="left">
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="search"></search-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" v-show="false" icon="iconfont icon-multi-download" @click="multiVisible=true">批量下载</el-button>
          <el-button size="mini" v-show="access==3 || access==255" icon="iconfont icon-downLoad" :disabled="!downloadUrl" @click="download">{{$t('common.download')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :select.sync="selection" :selectBox="true" :tableList="resultList">
          <template v-slot:firmwareStatus="{row}">
            {{row.firmwareStatus == 1 ? $t('common.test') : $t('common.rel')}}
          </template>
          <template v-slot:modelType="{row}">
            {{translateDeviceType(row.modelType)}}
          </template>
        </common-table>
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
        moduleSN: '',
        plantName: '',
        deviceSN: '',
        bmsMasterSN: '',
        bmsMasterVersion: '',
        bmsSlaveSN: '',
        bmsSlaveVersion: ''
      },
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: '逆变器sn',
          prop: 'type',
          checked: true
        },
        {
          label: '模块sn',
          prop: 'type',
          checked: true
        },
        {
          label: '告警名称',
          prop: 'type',
          checked: true
        },
        {
          label: '告警编号',
          prop: 'type',
          checked: true
        },
        {
          label: '报错类型',
          prop: 'type',
          checked: true
        },
        {
          label: '报错时间',
          prop: 'time',
          checked: true,
          slotName: 'time'
        }
      ]
    }
  },
  methods: {
    reset () {
    },
    search () {
    }
  }
}
</script>
<style lang="less" scoped>
</style>
