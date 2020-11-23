<template>
  <section class="sys-main" v-setH:min="setDivH">
    <show-item ref="plantStatus" @getselect="getselect" :positionList="positionList"></show-item>
    <!-- 表格区域 -->
    <el-card class="no-bottom">
      <div class="title border-line" slot="header">{{$t('plant.plantsList')}}</div>
      <search-bar>
        <el-form size="mini" label-width="0px" :model="searchForm" :inline="true">
          <el-form-item>
            <el-select v-model="searchForm.status">
              <el-option v-for="item in statusList" :label="$t('common.' + item.label)" :value="item.status" :key="item.status"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.name" :placeholder="$t('common.plantsName')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <search-button type="warning" icon="icon-clear" @click="reset"></search-button>
            <search-button type="success" icon="icon-search" @click="search"></search-button>
          </el-form-item>
        </el-form>
      </search-bar>
      <func-bar>
        <common-table :tableHeadData="plantTableHead" :tableList="resultList">
          <template v-slot:status="{row}">
            <i class="el-icon-error" v-show="Number(row.status) === 2"></i>
            <i class="el-icon-success" v-show="Number(row.status) === 1"></i>
            <i class="el-icon-remove" v-show="Number(row.status) === 3"></i>
          </template>
          <template v-slot:op="{row}">
            <div class="flex-center table-op-btn">
              <i title="view" class="iconfont icon-look" @click="goToDetail('look',row)"></i>
              <i title="edit" class="iconfont icon-edit"  @click="goToDetail('edit',row)"></i>
              <i title="delete" class="iconfont icon-delete" @click="deletePlant(row.stationID)"></i>
            </div>
          </template>
          <template v-slot:generationToday="{row}">
            {{toFixed(row.generationToday)}}
          </template>
          <template v-slot:power="{row}">
            {{toFixed(row.power)}}
          </template>
        </common-table>
        <div class="states-row">
          <span><i class="el-icon-success"></i> {{$t('common.normal')}}</span>
          <span><i class="el-icon-error"></i> {{$t('common.abnormal')}}</span>
          <span><i class="el-icon-remove"></i> {{$t('common.offline')}}</span>
        </div>
        <page-box :pagination.sync="pagination" @change="getList"></page-box>
      </func-bar>
    </el-card>
  </section>
</template>
<script>
import showItem from '../components/showItem'
import plantTableHead from './mixins/plantTableHead'
import { encodeData } from '@/util'
import { mapState } from 'vuex'
export default {
  components: {
    showItem
  },
  mixins: [plantTableHead],
  data () {
    return {
      appVersion: process.env.VUE_APP_VERSION,
      statusList: [
        { status: 0, label: 'all' },
        { status: 1, label: 'normal' },
        { status: 2, label: 'abnormal' },
        { status: 3, label: 'offline' }
      ],
      searchForm: {
        status: 0, // 0 全部 ，1 正常， 2 异常
        name: ''
      },
      pagination: {
        pageSize: 50,
        currentPage: 1,
        total: 0
      },
      resultList: [],
      plantAllList: [] // 所有电站列表
    }
  },
  created () {},
  async mounted () {
    this.$refs.plantStatus.getPlantStatus()
    await this.getList(this.pagination)
    await this.getAllPlant(this.pagination.total)
    // 在地图上标记电站
    if (this.appVersion === 'abroad') {
      this.$refs.plantStatus.$refs.googleMap.loadMap().then(this.addGoogleMarker)
    } else {
      this.$refs.plantStatus.$refs.gaodeMap.loadMap().then(this.addGaodeMarker)
    }
  },
  computed: {
    ...mapState({
      username: state => state.userInfo.user
    }),
    positionList () { // 经纬度列表
      let resultP = []
      this.plantAllList.forEach(item => {
        let { x, y } = item.position
        if (x && y) {
          resultP.push({
            position: [y, x],
            address: item.address
          })
        }
      })
      return resultP
    }
  },
  beforeDestroy () {},
  methods: {
    search () {
      this.pagination.currentPage = 1
      this.getList(this.pagination)
    },
    reset () {
      this.searchForm = {
        status: 0,
        name: ''
      }
      this.search()
    },
    // 获取所有电站列表
    async getAllPlant (total) {
      let { result } = await this.$post({
        url: '/c/v0/plant/list',
        data: {
          currentPage: 1,
          pageSize: total,
          condition: {
            status: 0,
            name: ''
          }
        }
      })
      if (result) {
        this.plantAllList = result.plants || []
      }
    },
    // 获取电站列表
    async getList (pagination) {
      let { result } = await this.$post({
        url: '/c/v0/plant/list',
        data: {
          ...pagination,
          condition: this.searchForm
        }
      })
      if (result) {
        this.pagination.total = result.total
        this.pagination.currentPage = result.currentPage
        this.pagination.pageSize = result.pageSize
        this.resultList = result.plants || []
      }
      return true
    },
    // 电站删除
    async deletePlant (id) {
      let res = await this.$openConfirm('common.tips2')
      if (!res) return
      let { result } = await this.$post({
        url: '/c/v0/plant/delete',
        data: {
          stationID: id
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.search()
      }
    },
    // 点击状态筛选列表
    getselect (payLoad) {
      this.searchForm.status = payLoad
      this.search()
    },
    // 页面跳转
    goToDetail (type, row) {
      if (type === 'look') {
        let { country, city, name } = row
        this.$tab.replace({
          name: 'bus-plant-detail',
          query: {
            plantId: row.stationID,
            pageFlag: 'detail',
            plantInfo: encodeData({ country, city, plantName: name })
          }
        })
      } else {
        this.$tab.replace({
          name: 'bus-plant-edit',
          query: {
            plantId: row.stationID
          }
        })
      }
    },
    // 添加gaode marker
    addGaodeMarker ({ AMap, map }) {
      if (this.positionList.length === 0) return
      let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
      this.positionList.forEach(item => {
        /*eslint-disable*/
        var marker = new AMap.Marker({
          map: map,
          position: item.position,
          offset: new AMap.Pixel(-13, -30)
        })
        marker.on('click', function (e) {
          infoWindow.setContent(item.address)
          infoWindow.open(map, e.target.getPosition())
        })
        // 默认不打开信息窗体
        // marker.emit('click', {target: marker})
      })
      map.setFitView() // 自适应
    },
    // 添加google marker
    addGoogleMarker ({ map }) {
      if (this.positionList.length === 0) return
      let infoWindow = new window.google.maps.InfoWindow()
      var bounds = new google.maps.LatLngBounds()
      this.positionList.forEach(item => {
        // 添加标记点
        let tempPos = { lng: Number(item.position[0]), lat: Number(item.position[1])}
        let marker = new window.google.maps.Marker({
          position: tempPos,
          map
        })
        bounds.extend(tempPos)
        // 信息窗
        marker.addListener('click', () => {
          infoWindow.open(map, marker)
          infoWindow.setContent(item.address)
          // infoWindow.setPosition(this.cuPosition)
        })
      })
      map.fitBounds(bounds)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
