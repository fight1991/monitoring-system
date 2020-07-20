
<template>
  <div :id="mapId" class="map-content" :style="{'height': height, 'width': width}"></div>
</template>
<script>
export default {
  data () {
    return {
      ak: 'NyTAf7KeueRYw66iDfFh20pDmxlGFrfO',
      mapId: '' // 地图容器 若id相同的话只渲染一次
    }
  },
  props: {
    height: {
      default: '100%'
    },
    width: {
      default: '100%'
    }
  },
  created () {
    this.mapId = 'map-content' + this.$route.name
    // window.addEventListener('resize', this.asyncInit)
  },
  mounted () {
    this.loadBMap().then(() => {
      this.asyncInit()
    })
  },
  methods: {
    initBaiduMap () {
      let baiduMap = window.BMap
      let map = new baiduMap.Map(this.mapId)
      map.centerAndZoom(new baiduMap.Point(116.331398, 39.897445), 11)
      map.enableScrollWheelZoom(true)
      var geolocation = new baiduMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === 0) {
          var mk = new baiduMap.Marker(r.point)
          map.addOverlay(mk)
          map.panTo(r.point)
        } else {
          console.log('获取定位失败')
        }
      }, { enableHighAccuracy: true })
    },
    asyncInit () {
      this.$nextTick(() => {
        this.initBaiduMap()
      })
    },
    loadBMap () {
      let that = this
      return new Promise(function (resolve, reject) {
        if (typeof window.BMap !== 'undefined') {
          resolve(window.BMap)
          return true
        }
        window.onBMapCallback = function () {
          resolve(window.BMap)
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src =
          'https://api.map.baidu.com/api?v=2.0&ak=' + that.ak + '&s=1&callback=onBMapCallback'
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.asyncInit)
  }
}
</script>
<style lang="less" scoped>

</style>
