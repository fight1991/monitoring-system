
<template>
  <div :id="mapId" class="map-content" :style="{'height': height, 'width': width}"></div>
</template>
<script>
export default {
  data () {
    return {
      ak: 'ffa1527d9cf893866bc676b3c699049f',
      mapId: '' // 地图容器 若id相同的话只渲染一次
    }
  },
  props: {
    height: {
      default: '100%'
    },
    width: {
      default: '100%'
    },
    autoGps: {
      default: true // h5自动定位
    },
    plugin: {
      type: Array,
      default: () => {
        return ['AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Geolocation', 'AMap.Geocoder']
      }
    }
  },
  created () {
    this.mapId = 'map-content' + this.$route.name
    // window.addEventListener('resize', this.asyncInit)
  },
  mounted () {
    this.loadAMap().then(() => {
      this.asyncInit()
    })
  },
  methods: {
    initAMap () {
      let AMap = window.AMap
      let map = new AMap.Map(this.mapId, {
        zoom: 12,
        center: [116.39, 39.9],
        resizeEnable: true
      })
      let that = this
      AMap.plugin([...that.plugin], function () {
        that.$emit('getMapInfo', { AMap, map })
        that.autoGps && that.getGeoLocation(AMap, map)
      })
    },
    getGeoLocation (AMap, map) {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: false, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
        buttonPosition: 'RB', // 定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: false, // 定位成功后是否自动调整地图视野到定位点
        showMarker: true
      })
      map.addControl(geolocation)
      geolocation.getCurrentPosition()
    },
    asyncInit () {
      this.$nextTick(() => {
        this.initAMap()
      })
    },
    loadAMap () {
      let that = this
      return new Promise(function (resolve, reject) {
        if (typeof window.AMap !== 'undefined') {
          resolve(window.AMap)
          return true
        }
        window.onAMapCallback = function () {
          resolve(window.AMap)
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src =
          'https://webapi.amap.com/maps?v=1.4.15&key=' + that.ak + '&callback=onAMapCallback'
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
