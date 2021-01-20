<template>
 <section class="sys-main container bg-c" v-setH="setDivH">
    <div class="top-box">
      <!-- 查询区域 -->
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
      <!-- 按钮区域 -->
      <div class="function-container">
        <el-row class="table-btn" type="flex" justify="end">
          <el-button size="mini" icon="iconfont icon-downLoad" :disabled="!downloadUrl" @click="download">{{$t('relog.export')}}</el-button>
        </el-row>
      </div>
    </div>
    <!-- 查询内容区域 -->
    <div class="content-box">
      <div v-if="report" v-html="report"></div>
      <div v-else class="no-data">暂无数据</div>
    </div>
      <div class="page-list">
        <div class="pagination flex-between">
          <span>{{$t('relog.total')}}&nbsp;{{total}}&nbsp;{{$t('relog.line')}}</span>
        </div>
      </div>
 </section>
</template>
<script>
import axios from 'axios'
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
        moduleSN: [{ required: true, message: this.messageValid('require'), trigger: 'blur' }]
        // times: [{ required: true, message: this.messageValid('require'), trigger: 'change' }]
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    download () {
      let url = this.downloadUrl
      if (process.env.NODE_ENV === 'development') {
        url = '/api' + url
      }
      try {
        axios({
          url,
          method: 'get',
          responseType: 'blob'
        }).then(res => {
          let nameArr = this.downloadUrl.split('/')
          let name = nameArr[nameArr.length - 1] || 'temp'
          if ('msSaveOrOpenBlob' in navigator) {
            navigator.msSaveOrOpenBlob(this.response, name)
            return
          }
          let url = URL.createObjectURL(new Blob([res.data]))
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.target = '_blank'
          a.download = name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        })
      } catch (error) {
        this.$message.error('Try to change browser')
      }
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
.container {
  display: flex;
  flex-direction: column;
}
.top-box {
  padding: 15px 10px 0;
}
.content-box {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 15px;
  margin: 0 10px;
  flex: 1;
  overflow: scroll;
  p {
    word-break: break-all;
  }
}
.no-data {
  text-align: center;
}
</style>
