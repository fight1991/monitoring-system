<template>
 <section class="sys-main flex-column-between bg-c" v-setH:min="setDivH">
    <!-- 查询区域 -->
    <div class="sys-table-container">
      <search-bar>
        <el-form size="mini" label-width="0px" ref="searchForm" :model="searchForm" :rules="rules">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item prop="moduleSN">
                <el-input v-model="searchForm.moduleSN" clearable :placeholder="$t('common.datacolSN')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                 <el-select style="width:100%" v-model="searchForm.level" clearable :placeholder="$t('relog.level')">
                  <el-option v-for="(item, index) in levelList" :label="item.value" :value="item.value" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select style="width:100%" v-model="searchForm.encoding" clearable :placeholder="$t('relog.encoding')">
                  <el-option v-for="(item, index) in encodingList" :label="item.value" :value="item.value" :key="item + index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="times">
                <el-date-picker
                  clearable
                  style="width:100%"
                  v-model="times"
                  value-format="timestamp"
                  type="daterange"
                  :picker-options="pickerOptions"
                  :range-separator="$t('common.to')"
                  :start-placeholder="$t('common.start')"
                  :end-placeholder="$t('common.end')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="left">
              <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
              <search-button type="success" icon="icon-search" @click="searchBtn"></search-button>
            </el-col>
          </el-row>
        </el-form>
      </search-bar>
      <!-- 列表查询区域 -->
      <func-bar>
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-downLoad" :disabled="!downloadUrl" @click="download">{{$t('relog.export')}}</el-button>
        </el-row>
        <div class="report" v-html="report"></div>
      </func-bar>
    </div>
    <div class="page-list">
      <div class="pagination flex-between" v-if='total != 0'  @change="getReport">
        <span>{{$t('relog.total')}}&nbsp;{{total}}&nbsp;{{$t('relog.line')}}</span>
      </div>
    </div>
 </section>
</template>
<script>
export default {
  data () {
    return {
      times: [],
      downloadUrl: '',
      searchForm: {
        moduleSN: '',
        level: 'ALL',
        encoding: 'ASCII',
        begin: {
          year: 0,
          month: 0,
          day: 0
        },
        end: {
          year: 0,
          month: 0,
          day: 0
        }
      },
      report: '',
      total: 0,
      levelList: [
        { value: 'ALL' },
        { value: 'TRACE' },
        { value: 'DEBUG' },
        { value: 'INFO' },
        { value: 'WARNNING' },
        { value: 'ERROR' },
        { value: 'FATAL' }
      ],
      encodingList: [
        { value: 'HEX' },
        { value: 'ASCII' }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        moduleSN: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }],
        times: [{ required: true, message: this.messageValid('require'), trigger: 'change' }]
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    download () {
      window.open(this.$store.state.domainName + this.downloadUrl, '_blank')
    },
    resetSearchForm () {
      this.searchForm = {
        moduleSN: '',
        level: 'ALL',
        encoding: 'ASCII',
        begin: {
          year: 0,
          month: 0,
          day: 0
        },
        end: {
          year: 0,
          month: 0,
          day: 0
        }
      }
      this.times = []
    },
    reset () {
      this.resetSearchForm()
      this.search()
      this.report = ''
      this.total = 0
      this.downloadUrl = ''
    },
    searchBtn () {
      let isValid = true
      this.$refs.searchForm.validate(valid => (isValid = valid))
      if (!isValid) return
      this.search()
    },
    search () {
      this.getReport()
    },
    async getReport () {
      if (this.times && this.times.length > 0) {
        this.searchForm.begin = {
          year: new Date(this.times[0]).getFullYear(),
          month: new Date(this.times[0]).getMonth() + 1,
          day: new Date(this.times[0]).getDate()
        }
        this.searchForm.end = {
          year: new Date(this.times[1]).getFullYear(),
          month: new Date(this.times[1]).getMonth() + 1,
          day: new Date(this.times[1]).getDate()
        }
      }
      let { result, error, other } = await this.$post({
        url: '/c/v0/syslog/battery',
        data: {
          ...this.searchForm
        }
      })
      if (result) {
        this.report = result.content || []
        this.downloadUrl = result.downloadUrl || ''
        this.total = result.total
      }
      if (error || other) {
        this.downloadUrl = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.report {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 10px;
  overflow: scroll;
}
</style>
