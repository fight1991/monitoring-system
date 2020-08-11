
<template>
<div class="map-container" style="width:100%;height:100%" v-loading="mapLoading">
  <div :id="mapId" class="map-content" :style="{'height': height, 'width': width}"></div>
</div>
</template>
<script>
export default {
  data () {
    return {
      ak: '052e002c53d00e0f81459c89f622b69c',
      mapLoading: false,
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
  methods: {
    initAMap (callback) {
      let AMap = window.AMap
      let map = new AMap.Map(this.mapId, {
        zoom: 12,
        center: [116.39, 39.9],
        resizeEnable: true,
        lang: this.$store.state.lang === 'zh' ? 'zh_cn' : 'en'
      })
      AMap.plugin([...this.plugin], () => {
        // this.$emit('getMapInfo', { AMap, map })
        this.mapLoading = false
        callback && callback(map)
        this.autoGps && this.getGeoLocation(AMap, map)
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
    loadMap () {
      return new Promise((resolve, reject) => {
        this.mapLoading = true
        if (typeof window.AMap !== 'undefined') {
          this.initAMap((map) => {
            resolve({ AMap: window.AMap, map })
          })
          return
        }
        window.onAMapCallback = () => {
          this.initAMap((map) => {
            resolve({ AMap: window.AMap, map })
          })
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src =
          'https://webapi.amap.com/maps?v=1.4.15&key=' + this.ak + '&callback=onAMapCallback'
        script.onerror = () => {
          this.mapLoading = false
          this.$message.error('map loaded failed')
          reject(new Error('fail'))
        }
        document.head.appendChild(script)
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
