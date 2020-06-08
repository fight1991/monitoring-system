<template>
  <div id="g-map" :style="{'height': height, 'width': width}"></div>
</template>

<script>
export default {
  data () {
    return {
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
    }
  },
  watch: {},
  created () {
    // this.getGeoLocation()
  },
  mounted () {
    this.loadGMap().then(() => {
      this.initMap()
      this.getGeoLocation()
    }).catch(() => {
      // 谷歌地图引用失败
      this.$message.error('国内网路访问谷歌地图失败,请翻墙重试!')
      this.$emit('gMapError')
    })
  },
  methods: {
    initMap () {
      let gMap = window.google
      this.gMap = new gMap.maps.Map(document.getElementById('g-map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      })
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
    getLocationError () {
      console.log('error获取经纬度信息失败')
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
          'https://maps.googleapis.com/maps/api/js?key=' + this.key + '&language=en&callback=onGMapCallback'
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
