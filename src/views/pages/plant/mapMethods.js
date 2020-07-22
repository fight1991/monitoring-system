export default {
  data () {
    return {
      tempAdressInfo: {
        country: '', // 国家
        administrative_area_level_1: '', // 省
        locality: '', // 市
        placeId: '',
        lat: '',
        lng: ''
      }
    }
  },
  created () {},
  methods: {
    // 得到地图实例
    getMapInfo ({ map, AMap }) {
      if (map) {
        this.appVersion === 'abroad' ? this.initGoogleMap(map) : this.initAMap(AMap, map)
      }
    },
    // 初始化高德地图
    initAMap (AMap, map) {
      let $input = this.$refs['place-map'].$refs['input']
      var autoComplete = new AMap.Autocomplete({
        input: $input
      })
      // var placeSearch = new AMap.PlaceSearch({ map })
      AMap.event.addListener(autoComplete, 'select', (e) => {
        // TODO 针对选中的poi实现自己的功能
        console.log(e)
        // placeSearch.search(e.poi.name)
        // 添加marker
        var marker = new AMap.Marker({
          map,
          position: e.poi.location
        })
        map.setCenter(marker.getPosition())
      })
    },
    // 初始化谷歌地图
    initGoogleMap (map) {
      let google = window.google
      let $input = this.$refs['place-map'].$refs['input']
      let componentForm = {
        locality: 'long_name', // 市
        administrative_area_level_1: 'short_name', // 省
        country: 'long_name' // 国家
      }
      let autocomplete = new google.maps.places.Autocomplete($input)
      autocomplete.bindTo('bounds', map)
      autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'place_id'])
      var marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29)
      })
      autocomplete.addListener('place_changed', () => {
        marker.setVisible(false)
        var place = autocomplete.getPlace()
        console.log(place)
        this.resetPosition()
        if (!place.geometry) {
          window.alert('No details available for input: ' + place.name)
          return
        }
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0]
          if (componentForm[addressType]) {
            let val = place.address_components[i][componentForm[addressType]]
            this.tempAdressInfo[addressType] = val || ''
          }
        }
        this.tempAdressInfo.placeId = place.place_id || ''
        this.tempAdressInfo.lat = place.geometry.location.lat()
        this.tempAdressInfo.lng = place.geometry.location.lng()
        this.initDataFormAddress()
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport)
        } else {
          map.setCenter(place.geometry.location)
          map.setZoom(17) // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location)
        marker.setVisible(true)
      })
    },
    initDataFormAddress () {
      /*eslint-disable*/
      let { country, administrative_area_level_1, locality, placeId, lat, lng } = JSON.parse(JSON.stringify(this.tempAdressInfo))
      this.dataForm.details.city = administrative_area_level_1 + locality
      this.dataForm.details.country = country
      this.dataForm.position.pid = placeId
      this.dataForm.position.x = lat
      this.dataForm.position.y = lng
      // 初始化时区
      this.getZoneList(country)
    },
    resetPosition () {
      this.tempAdressInfo = {
        country: '',
        administrative_area_level_1: '',
        locality: '',
        placeId: '',
        lat: '',
        lng: ''
      }
      this.dataForm.details.city = ''
      this.dataForm.details.country = ''
      this.dataForm.position.pid = ''
      this.dataForm.position.x = ''
      this.dataForm.position.y = ''
    },
  }
}