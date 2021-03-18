<template>
  <div class="map-container" style="width:100%;height:100%" v-loading="mapLoading">
    <div :id="mapId" :style="{'height': height, 'width': width}"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mapLoading: false,
      map: null,
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
    this.mapId = 'map-google' + this.$route.name
  },
  watch: {},
  mounted () {},
  methods: {
    initMap (callback) {
      let gMap = window.google
      this.map = new gMap.maps.Map(document.getElementById(this.mapId), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      })
      this.mapLoading = false
      callback && callback(this.map)
      this.autoGps && this.getGeoLocation()
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
      this.map.setCenter(this.cuPosition)
      // 添加标记点
      let marker = new window.google.maps.Marker({
        position: this.cuPosition
      })
      marker.setMap(this.map)
      // 信息窗
      let infoWindow = new window.google.maps.InfoWindow()
      infoWindow.setPosition(this.cuPosition)
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker)
      })
    },
    getLocationError (res) {
      console.log('lng and lat get error')
    },
    loadMap () {
      return new Promise((resolve, reject) => {
        this.mapLoading = true
        if (typeof window.google !== 'undefined') {
          this.initMap((map) => {
            resolve({ map })
          })
          return
        }
        window.onGMapCallback = () => {
          this.initMap((map) => {
            resolve({ map })
          })
        }
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.setAttribute('async', true)
        script.setAttribute('defer', true)
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${this.key}&language=${this.$store.state.lang}&libraries=places&callback=onGMapCallback`
        script.onerror = () => {
          this.mapLoading = false
          this.$emit('gMapError')
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
