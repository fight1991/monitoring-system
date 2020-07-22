<template>
  <div style="width:100%;height:100%" v-loading="mapLoading">
    <div id="g-map" :style="{'height': height, 'width': width}"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mapLoading: true,
      gMap: null,
      cuPosition: null,
      key: 'AIzaSyCRQmc6dZEosKrS54hJGlMvpOhUglfbo3Q'
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
    }
  },
  created () {
    // this.getGeoLocation()
  },
  watch: {},
  mounted () {
    this.loadGMap().then(() => {
      this.initMap()
      this.autoGps && this.getGeoLocation()
    }).catch(() => {
      // 谷歌地图引用失败
      this.$message.error('load map failure')
      this.$emit('gMapError')
    }).finally(() => {
      this.mapLoading = false
    })
  },
  methods: {
    initMap () {
      let gMap = window.google
      this.gMap = new gMap.maps.Map(document.getElementById('g-map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      })
      this.$emit('getMapInfo', { map: this.gMap })
    },
    // h5获取当前经纬度信息并标识在
    getGeoLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.getLocationSuccess, this.getLocationError)
      } else {
        console.log('获取经纬度信息失败')
      }
    },
    getLocationSuccess (res) {
      this.cuPosition = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      }
      // 重新设置中心点
      this.gMap.setCenter(this.cuPosition)
      // 添加标记点
      let marker = new window.google.maps.Marker({
        position: this.cuPosition
        // title: 'hellow'
      })
      marker.setMap(this.gMap)
      // 信息窗
      let infoWindow = new window.google.maps.InfoWindow()
      infoWindow.setPosition(this.cuPosition)
      infoWindow.setContent('Location found.')
      marker.addListener('click', () => {
        infoWindow.open(this.gMap, marker)
      })
    },
    getLocationError (res) {
      console.log('lng and lat get error')
    },
    loadGMap () {
      return new Promise((resolve, reject) => {
        if (typeof window.google !== 'undefined') {
          resolve(window.google)
          return
        }
        window.onGMapCallback = function () {
          resolve(window.google)
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.setAttribute('async', true)
        script.setAttribute('defer', true)
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${this.key}&language=${this.$store.state.lang}&libraries=places&callback=onGMapCallback`
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
