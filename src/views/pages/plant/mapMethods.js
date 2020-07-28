export default {
  data () {
    return {
      countryShortName: '',
      gMapAdress: { // 谷歌地图暂存容器
        country: '', // 国家
        administrative_area_level_1: '', // 省
        locality: '', // 市
        placeId: '',
        lat: '',
        lng: ''
      }
    }
  },
  mounted () {},
  methods: {
    // 加载地图
    importMap () {
      if (this.appVersion === 'abroad') {
        this.$refs.googleMap.loadMap().then(this.initGoogleMap)
      } else {
        this.$refs.gaodeMap.loadMap().then(this.initAMap)
      }
    },
    // 初始化高德地图
    initAMap ({ AMap, map }) {
      let $input = this.$refs['place-map'].$refs['input']
      var autoComplete = new AMap.Autocomplete({
        input: $input
      })
      // var placeSearch = new AMap.PlaceSearch({ map })
      AMap.event.addListener(autoComplete, 'select', (e) => {
        // TODO 针对选中的poi实现自己的功能
        this.resetPosition()
        // placeSearch.search(e.poi.name)
        // 添加marker
        this.dataForm.details.address = e.pi.name
        addMarker(e.poi.location)
        var geocoder = new AMap.Geocoder()
        let { lng, lat } = e.poi.location
        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            var address = result.regeocode.addressComponent
            this.countryShortName = 'CN'
            let { country, city, province } = address
            this.initGaodeForm(lat, lng, country, province, city)
          }
        })
      })
      // 编辑电站时初始化地图
      if (this.opType === 'edit') {
        let { x, y } = this.dataForm.position
        addMarker([Number(y), Number(x)])
      }
      function addMarker (position) {
        var marker = new AMap.Marker({
          map,
          position: position
        })
        map.setCenter(marker.getPosition())
      }
    },
    // 初始化谷歌地图
    initGoogleMap ({ map }) {
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
        this.resetPosition()
        if (!place.geometry) {
          window.alert('No details available for input: ' + place.name)
          return
        }
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0]
          if (componentForm[addressType]) {
            let val = place.address_components[i][componentForm[addressType]]
            this.gMapAdress[addressType] = val || ''
            if (addressType === 'country') {
              this.countryShortName = place.address_components[i]['short_name']
            }
          }
        }
        this.gMapAdress.placeId = place.place_id || ''
        this.gMapAdress.lat = place.geometry.location.lat()
        this.gMapAdress.lng = place.geometry.location.lng()
        this.dataForm.details.address = place.name
        this.initGoogleForm()
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport)
        } else {
          map.setCenter(place.geometry.location)
          map.setZoom(12) // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location)
        marker.setVisible(true)
      })
      if (this.opType === 'edit') {
        let { x, y } = this.dataForm.position
        let latLng = new google.maps.LatLng(x, y)
        map.setCenter(latLng)
        map.setZoom(12)
        marker.setPosition(latLng)
        marker.setVisible(true)
      }
    },
    initGaodeForm (lat, lng, country, province, city) {
      this.dataForm.position.x = lat
      this.dataForm.position.y = lng
      this.dataForm.details.country = country
      this.dataForm.details.city = province + city
      // 初始化时区
      this.getZoneList(this.countryShortName)
    },
    initGoogleForm () {
      /*eslint-disable*/
      let { country, administrative_area_level_1, locality, placeId, lat, lng } = JSON.parse(JSON.stringify(this.gMapAdress))
      this.dataForm.details.city = administrative_area_level_1 + locality
      this.dataForm.details.country = country
      this.dataForm.position.pid = placeId
      this.dataForm.position.x = lat
      this.dataForm.position.y = lng
      // 初始化时区
      this.getZoneList(this.countryShortName)
    },
    resetPosition () {
      if (this.appVersion === 'abroad') {
        this.gMapAdress = {
          country: '',
          administrative_area_level_1: '',
          locality: '',
          placeId: '',
          lat: '',
          lng: ''
        }
      }
      this.dataForm.details.city = ''
      this.dataForm.details.country = ''
      this.dataForm.position.pid = ''
      this.dataForm.position.x = ''
      this.dataForm.position.y = ''
    }
  }
}