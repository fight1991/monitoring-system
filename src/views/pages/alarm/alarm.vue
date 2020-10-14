<template>
  <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <div class="sys-table-container">
      <el-form size="mini" :model="searchForm">
          <el-row :gutter="15">
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.plant" clearable :placeholder="$t('common.plant')">
                  <el-option v-for="(item, index) in plantsList" :label="item.label" :value="item.value" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.invertSn" clearable :placeholder="$t('common.invertSn')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.alarmType" clearable :placeholder="$t('common.alarmType')">
                  <el-option v-for="(item, index) in alarmTypeList" :label="item.label" :value="item.value" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.alarmName" clearable :placeholder="$t('alarm.alarmName')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.datacolSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker
                clearable
                style="width:100%"
                v-model="times"
                value-format="timestamp"
                type="daterange"
                :range-separator="$t('common.to')"
                :start-placeholder="$t('common.start')"
                :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <el-button size="mini" icon="el-icon-close" @click="reset">{{$t('common.reset')}}</el-button>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search">{{$t('common.search')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-multi-download" @click="multiVisible=true">批量下载</el-button>
          <el-button size="mini" icon="iconfont icon-downLoad" @click="download">{{$t('common.download')}}</el-button>
        </el-row>
        <common-table :tableHeadData="tableHead" :selectBox="true"></common-table>
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
      searchForm: {},
      plantsList: [{
        value: 's1',
        label: 'plant1'
      }, {
        value: 's2',
        label: 'plant2'
      }, {
        value: 's3',
        label: 'plant3'
      }, {
        value: 's4',
        label: 'plant4'
      }],
      invertSn: '',
      alarmTypeList: [{
        value: 'e1',
        label: 'error1'
      }, {
        value: 'e2',
        label: 'error2'
      }, {
        value: 'e3',
        label: 'error3'
      }, {
        value: 'e4',
        label: 'error4'
      }],
      alarmName: '',
      datacolSN: '',
      times: [],
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      tableHead: [
        {
          label: 'common.invertSn',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.datacolSN',
          prop: 'type',
          checked: true
        },
        {
          label: 'alarm.alarmName',
          prop: 'type',
          checked: true
        },
        {
          label: 'alarm.alarmNum',
          prop: 'type',
          checked: true
        },
        {
          label: 'common.alarmType',
          prop: 'type',
          checked: true
        },
        {
          label: 'plant.reportTime',
          prop: 'time',
          checked: true,
          slotName: 'time'
        }
      ]
    }
  },
  methods: {
    reset () {
      this.searchForm = {
        plantsList: '',
        invertSn: '',
        alarmTypeList: '',
        alarmName: '',
        datacolSN: ''
      }
      this.times = []
      this.search()
    },
    search () {
      alert('搜索')
    },
    download () {
      alert('下载')
    },
    getList () {

    }
  }
}
</script>
<style lang="less" scoped>
</style>
