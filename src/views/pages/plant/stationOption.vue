<template>
  <section class="sys-main sys-form-style-label bg-c" v-setH:min="setDivH">
    <el-form size="mini" :model="dataForm" ref="dataForm" :rules="rules" label-position="left" label-width="110px">
      <div class="top">
        <div class="title border-line">{{$t('plant.plantSet')}}</div>
        <div class="col-container">
          <el-row :gutter="60">
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('join.agent')" prop="agent">
                <el-select v-model="dataForm.agent" :disabled="endUserNoUse && inputController" style="width:100%" :placeholder="$t('common.select')">
                  <el-option v-for="(item, index) in agentList" :key="'index' + index" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.name')" prop="details.name">
                <el-input v-model="dataForm.details.name" :disabled="endUserNoUse && inputController" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.type')" prop="details.type">
                <el-select v-model="dataForm.details.type" :disabled="endUserNoUse && inputController" style="width:100%" filterable default-first-option :placeholder="$t('common.select')">
                  <el-option :label="$t('common.light')" :value="1" key="1"></el-option>
                  <el-option :label="$t('common.energy')" :value="2" key="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.country')" prop="details.country">
                <el-input disabled v-model="dataForm.details.country"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.country')" prop="details.country">
                <el-select v-model="dataForm.details.country" filterable style="width:100%" @change="getZoneListByHand" :disabled="endUserNoUse && inputController" :placeholder="$t('common.select')">
                  <el-option v-for="item in countryList" :key="item.code" :value="item.name" :label="item.name"></el-option>
                </el-select>
                <!-- <el-autocomplete
                  :popper-append-to-body="false"
                  popper-class="autocomplete-input"
                  style="width: 100%"
                  v-model="dataForm.details.country"
                  value-key="name"
                  @select="getZoneListByHand"
                  :fetch-suggestions="querySearch"
                ></el-autocomplete> -->
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.city')" prop="details.city">
                <el-input v-model="dataForm.details.city" :disabled="endUserNoUse && inputController"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.address')" prop="details.address">
                <el-input :disabled="endUserNoUse && inputController" v-model="dataForm.details.address"></el-input>
                <el-popover
                  @show="importMap()"
                  popper-class="map-popper"
                  placement="bottom"
                  :disabled="endUserNoUse && inputController"
                  trigger="click">
                  <span :title="$t('plant.searchP')" class="chooseMap-btn" slot="reference" v-show="!(endUserNoUse && inputController)"><i class="map-icon el-icon-location-information"></i></span>
                  <div class="map-place">
                    <div class="input-box flex-vertical-center">
                      <span class="key-word">{{$t('common.keyword')}}</span>
                      <input class="native-input" ref="place-map" @change="addressChange" @blur="addressBlur" v-model="dataForm.details.address">
                    </div>
                    <g-map ref="googleMap" :autoGps="opType=='add'" v-if="appVersion=='abroad'"></g-map>
                    <a-map ref="gaodeMap" v-else :autoGps="opType=='add'"></a-map>
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('common.postcode')" prop="details.postcode">
                <el-input v-model="dataForm.details.postcode" :disabled="endUserNoUse && inputController" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8" v-if="hasSummerTime">
              <el-form-item :label="$t('plant.summerTime')" prop="daylight">
                <el-select v-model="dataForm.daylight" :disabled="endUserNoUse && inputController" filterable style="width:100%" :placeholder="$t('common.select')">
                  <el-option v-for="item in zoneInfo.daylights" :key="item" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('common.zone')" prop="timezone">
                <el-select v-model="dataForm.timezone" filterable :disabled="!zoneIsShow" style="width:100%" :placeholder="$t('common.select')">
                  <el-option v-for="item in zoneInfo.timezones" :key="item" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('common.pvcapacity')" prop="details.systemCapacity">
                <el-input v-model="dataForm.details.systemCapacity" :disabled="endUserNoUse && inputController" clearable>
                  <span slot="suffix">kWp</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.price')" prop="details.price">
                <el-input v-model="dataForm.details.price" :disabled="endUserNoUse && inputController" clearable>
                  <span slot="suffix">/kW·h</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('common.currency')" prop="details.currency">
                <el-select default-first-option filterable v-model="dataForm.details.currency" :disabled="endUserNoUse && inputController" style="width:100%" :placeholder="$t('common.select')">
                  <el-option
                    v-for="item in currencyList"
                    :key="item" :value="item"
                    :label="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="title equipment border-line">{{$t('plant.epBind')}} <i class="el-add-icon el-icon-circle-plus-outline" @click="deviceAdd"></i></div>
      <div class="devices-box">
        <el-row :gutter="10">
          <!-- validator: (rule, value, callback)=>{checkSN(rule, value, callback, 'sn')} -->
          <el-col :lg="8" :sm="12" v-for="(item, index) in dataForm.devices" :key="'index'+index">
            <el-col :span="20">
              <el-form-item label-width="80px" :label="$t('plant.sn')" :prop="'devices.'+index+'.sn'" :rules="[{required:true, message: messageValid('require'), trigger: 'blur'}, {validator: checkSameItem, trigger: 'blur'}]">
                <el-input v-model="item.sn" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="padding-left:0px">
              <span class="op-icon">
                <i class="iconfont icon-delete" @click="deviceDelete(index, item.sn)"></i>
                <i class="el-icon-error" v-show="item.isPass === 0"></i>
              </span>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <!-- 代理商权限 -->
      <div v-if="access > 2">
        <div class="title equipment border-line">{{$t('sapn.addProp')}}</div>
        <div class="devices-box">
          <el-row :gutter="10">
            <el-col :lg="8" :sm="12">
              <el-col :span="20">
                <el-form-item label="NMI" label-width="80px" >
                  <el-input v-model="dataForm.attachment.nmi" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div class="title equipment border-line">{{$t('sapn.groupInfo')}}<i class="el-add-icon el-icon-circle-plus-outline" @click="groupAdd"></i></div>
        <div class="devices-box">
          <el-row :gutter="10">
            <el-col :lg="8" :sm="12" v-for="(item, index) in groupsParams" :key="item.value + index">
              <el-col :span="20">
                <el-form-item label-width="80px" :label="$t('sapn.group')">
                  <el-select default-first-option allow-create filterable v-model="item.value" style="width:100%">
                    <el-option v-for="child in groupList" :key="child" :value="child" :label="child">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="padding-left:0px">
                <span class="op-icon">
                  <i class="iconfont icon-delete" @click="groupDelete(index, item.value)"></i>
                </span>
              </el-col>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-row class="foot-btn" type="flex" justify="center" v-if="opType!=='look'">
      <el-button size="mini" @click="cancel">{{$t('plant.cancel')}}</el-button>
      <el-button size="mini" @click="confirmBtn" type="primary">{{opType=='add'?$t('plant.new'):$t('plant.edit')}}</el-button>
    </el-row>
    <el-dialog
      :title="$t('plant.invalidSn')"
      width="300px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="errVisible">
      <div v-for="item in errorList" :key="item.sn">
        {{item.sn}}
      </div>
      <el-row slot="footer" type="flex" justify="center">
        <el-button size="mini" @click="dialogCancel">{{$t('plant.cancel')}}</el-button>
        <el-button size="mini" type="primary" @click="dialogConfirm">{{$t('plant.goOn')}}</el-button>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import gMap from '@/views/components/gMap'
import aMap from '@/views/components/aMap'
import mapMethods from './mixins/mapMethods'
export default {
  mixins: [mapMethods],
  components: {
    gMap,
    aMap
  },
  data () {
    return {
      opType: 'add', // 记录操作类型 add创建, look查看 edit编辑
      inputController: true, // 终端用户关联电站时失败时,想要创建电站
      errno: '', // 处理终端用户创建电站的接口地址
      plantId: '', // 电站id
      appVersion: process.env.VUE_APP_VERSION,
      isSelectMap: false,
      snIsPass: true,
      errVisible: false,
      searchLoading: false,
      snResult: [], // sn校验的结果
      agentList: [],
      zoneInfo: { // 时区信息
        useDaylight: false,
        timezones: [],
        daylights: []
      },
      placeList: [], // 地图匹配的列表
      countryList: [], // 国家列表
      dataForm: {
        attachment: {
          nmi: ''
        },
        groups: [],
        devices: [
          { sn: '', key: '', isPass: 1 }
        ],
        timezone: '',
        daylight: '',
        agent: '',
        position: {
          format: 'dd',
          pid: '',
          x: '', // 纬度
          y: '' // 经度
        },
        details: {
          name: '',
          type: '',
          country: '',
          city: '',
          address: '',
          price: '',
          currency: '',
          capacity: '',
          quantity: '',
          stationID: '',
          owner: '',
          createdDate: '',
          postcode: '',
          systemCapacity: ''
        }
      },
      groupsParams: [{ value: '' }],
      copyDataForm: {},
      templateDevice: {
        sn: '',
        key: '',
        isPass: 1
      },
      templateGroup: [],
      rules: {},
      currencyList: [],
      groupList: []
    }
  },
  async created () {
    this.opType = this.$route.meta.opType
    // 终端用户新增时电站设置隐藏 故不需要初始化下拉框数据
    if (this.access > 1 || (this.access === 1 && this.opType === 'edit')) {
      await this.initFormData()
    }
    if (this.opType === 'edit') {
      this.plantId = this.$route.query.plantId
      this.isSelectMap = true
      await this.getStationInfo(this.plantId)
    }
    // 复制模板
    this.copyDataForm = JSON.parse(JSON.stringify(this.dataForm))
  },
  mounted () {
    // this.importMap()
  },
  watch: {},
  beforeDestroy () {
    this.timer && clearTimeout(this.timer)
  },
  computed: {
    deleteBtn () { // 绑定的设备length为1 且 设备序列号或注册码为空不显示删除按钮
      return this.dataForm.devices.length === 1 && !this.dataForm.devices[0].sn
    },
    isAllPass () { // 所有sn校验成功
      return this.snResult.length > 0 && this.snResult.every(v => v.errno === 0)
    },
    isAllError () { // 全部错误
      return this.snResult.length > 0 && this.snResult.every(v => v.errno !== 0)
    },
    errorList () {
      let temp = this.snResult.filter(v => v.errno !== 0)
      return temp.map(v => v.device)
    },
    zoneIsShow () {
      return this.zoneInfo.timezones && this.zoneInfo.timezones.length > 0
    },
    hasSummerTime () { // 是否有夏令时
      return this.zoneInfo.useDaylight || (this.opType === 'edit' && this.dataForm.daylight)
    },
    endUserNoUse () {
      return this.access === 1 && this.opType === 'add'
    }
  },
  methods: {
    // querySearch (queryString, cb) {
    //   let restaurants = this.countryList
    //   let results = queryString ? restaurants.filter(this.createFilter(queryString)).slice(0, 10) : restaurants.slice(0, 10)
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter (queryString) {
    //   return (restaurant) => {
    //     return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // 表单数据初始化
    async initFormData () {
      this.rules = this.setFormRules(true)
      await this.getCurrencyList()
      await this.getAgentList()
      this.countryList = await this.getCountryList()
      if (this.access > 2) { // 厂商和代理商
        await this.getGroupList()
      }
      if (this.opType === 'add') {
        this.dataForm.details.currency = this.currencyList[0] || ''
      }
      return true
    },
    // 设置校验规则
    setFormRules (isRequired = false) {
      return {
        agent: [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        timezone: [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        daylight: [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.name': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.type': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        'details.country': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        'details.city': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.address': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.currency': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        'details.price': [
          { required: isRequired, message: this.messageValid('require'), trigger: 'blur' },
          { message: this.messageValid('valid'), pattern: /^([0-9]+\.)?[0-9]+$/, trigger: 'blur' }
        ],
        'details.systemCapacity': [
          { required: isRequired, message: this.messageValid('require'), trigger: 'blur' },
          { message: this.messageValid('valid'), pattern: /^([0-9]+\.)?[0-9]+$/, trigger: 'blur' }
        ],
        'details.postcode': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }]
      }
    },
    // 设备新增
    deviceAdd () {
      this.dataForm.devices.push({ ...this.templateDevice })
    },
    // 分组新增
    groupAdd () {
      this.groupsParams.push({ value: '' })
    },
    // 获取代理商列表
    async getAgentList () {
      let { result } = await this.$get({
        url: '/c/v0/user/agents'
      })
      if (result) {
        this.agentList = result.agents || []
        // 设置默认值
        if (this.opType === 'add') {
          this.dataForm.agent = result.default || ''
        }
      }
    },
    // 获取币种列表
    async getCurrencyList () {
      let { result } = await this.$get({
        url: '/c/v0/plant/earnings/currency'
      })
      if (result && result.length > 0) {
        this.currencyList = result
      }
      return true
    },
    // 获取组列表
    async getGroupList () {
      let { result } = await this.$get({
        url: '/sapn/v0/device/schedule/groups'
      })
      if (result) {
        this.groupList = result.groups
      }
    },
    // 手动选择国家时初始化时区列表
    getZoneListByHand (countryName) {
      let obj = this.countryList.find(v => v.name === countryName)
      if (!obj) return
      this.initZoneList(obj.code)
    },
    // 地图选择国家时初始化时区列表
    initZoneList (shortName) {
      this.dataForm.timezone = ''
      this.dataForm.daylight = ''
      this.getZoneList(shortName)
    },
    // 电站编辑时初始化 时区列表
    setZoneData (countryName) {
      let obj = this.countryList.find(v => v.name === countryName)
      if (!obj) return
      this.getZoneList(obj.code)
    },
    // 获取时区列表
    async getZoneList (shortName) {
      let { result } = await this.$get({
        url: '/c/v0/map/timezones',
        data: {
          country: shortName
        }
      })
      if (result) {
        this.zoneInfo = result
      }
    },
    // 设备删除
    async deviceDelete (index, sn) {
      let res = await this.$openConfirm({
        content: this.$t('common.tips2') + ' ' + sn
      })
      if (!res) return
      if (index === 0 && this.dataForm.devices.length === 1) {
        if (this.dataForm.devices[0].sn) {
          this.dataForm.devices = [{ ...this.templateDevice }]
        }
      } else {
        this.dataForm.devices.splice(index, 1)
      }
    },
    // 分组删除
    async groupDelete (index, group) {
      let res = await this.$openConfirm({
        content: this.$t('common.tips2') + ' ' + group
      })
      if (!res) return
      if (index === 0 && this.groupsParams.length === 1) {
        if (this.groupsParams[0].value) {
          this.groupsParams = [{ value: '' }]
        }
      } else {
        this.groupsParams.splice(index, 1)
      }
    },
    // dialog取消
    dialogCancel () {
      this.snResult.forEach((v, i) => {
        if (v.errno !== 0) {
          this.dataForm.devices[i].isPass = 0
        } else {
          this.dataForm.devices[i].isPass = 1
        }
      })
      this.$forceUpdate()
      this.errVisible = false
    },
    // dialog中的确认
    dialogConfirm () {
      this.errVisible = false
      this.savePlant()
    },
    // 取消按钮
    async cancel () {
      let res = await this.$openConfirm({
        content: this.$t('common.tips1')
      })
      if (res) {
        this.dataForm = JSON.parse(JSON.stringify(this.copyDataForm))
        this.groupsParams = [{ value: '' }]
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      }
    },
    // 校验输入的sn是否已存在
    checkSameItem (rule, value, callback) {
      if (!value) {
        callback()
      }
      let isExist = this.dataForm.devices.filter(v => v.sn === value)
      if (isExist && isExist.length > 1) {
        callback(new Error(this.$t('plant.snIsExist')))
        return
      }
      callback()
    },
    // 确认按钮
    async confirmBtn () {
      // 表单必填项校验
      let isPass = true
      this.$refs.dataForm.validate(valid => (isPass = valid))
      if (!isPass) return
      await this.remoteSN(this.dataForm.devices)
      // 全部错误 不弹框直接标识
      if (this.isAllError) {
        this.dialogCancel()
        return
      }
      // 全部正确
      if (this.isAllPass) {
        this.savePlant()
        return
      }
      // 有的sn校验失败显示弹框
      if (!this.isAllError && !this.isAllPass && this.snResult.length > 0) {
        this.errVisible = true
      }
    },
    // 获取不同操作状态先的url
    getUrlForApi () {
      let url = ''
      // 南澳接口代理商权限
      if (this.access > 2) {
        if (this.opType === 'add') {
          url = '/sapn/v0/plant/create'
        } else {
          url = '/sapn/v0/plant/update'
        }
      } else {
        if (this.opType === 'add') {
          url = '/c/v0/plant/create'
          if (this.errno === 41934) {
            url = '/c/v1/plant/create'
          }
        } else {
          url = '/c/v0/plant/update'
        }
      }
      return url
    },
    // 新建电站 / 编辑电站
    async savePlant () {
      let url = this.getUrlForApi()
      if (!this.hasSummerTime) {
        this.dataForm.daylight = ''
      }
      if (this.access > 2) {
        this.dataForm.groups = this.groupsParams.map(v => v.value)
      }
      let { result, other } = await this.$post({
        url: url,
        data: {
          ...this.dataForm
        }
      })
      let backName = 'bus-plant-view'
      if (this.$route.meta.title === 'plantL') {
        backName = 'bus-data-view'
      }
      if (result) {
        this.$message.success(this.$t('common.success'))
        this.$tab.back({
          name: backName
        })
      }
      // 处理终端用户没有关联上电站的逻辑
      if (other && other.errno === 41934 && this.access === 1) {
        let res = await this.$openConfirm({
          content: this.$t('plant.snIsLink')
        })
        if (res) {
          this.errno = other.errno
          this.$tab.setTitle('plantN')
          this.inputController = false
          this.initFormData()
          this.$nextTick(() => {
            this.$refs.dataForm.clearValidate()
          })
        }
      }
    },
    // 远程校验sn 任意一对sn-key验证通过都可创建成功,全部sn-key失败则创建失败
    async remoteSN (item) {
      let { result, other } = await this.$post({
        url: '/c/v0/module/checksn',
        data: {
          type: this.access === 1 ? 0 : this.opType === 'add' ? 1 : 2,
          devices: item,
          stationID: this.plantId
        }
      })
      this.snResult = result || other.result || []
      return true
    },
    // 查询电站信息
    async getStationInfo (stationID) {
      let { result } = await this.$get({
        url: '/sapn/v0/plant/get',
        data: {
          stationID
        }
      })
      if (result) {
        if (!result.devices) {
          result.devices = [this.templateDevice]
        }
        if (result.groups && result.groups.length > 0) {
          this.groupsParams = result.groups.map(v => {
            return {
              value: v
            }
          })
        }
        this.setZoneData(result.details.country)
        this.dataForm = result
      }
      return true
    },
    addressBlur () {
      if (!this.isSelectMap) {
        this.dataForm.details.address = ''
      }
    },
    addressChange (e) {
      this.isSelectMap = false
      if (!e.target.value) {
        this.zoneInfo.timezones = []
        this.dataForm.details.country = ''
        this.dataForm.details.city = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.map-icon {
  font-size: 22px;
  color: @sys-main-header;
  cursor: pointer;
  padding: 3px 5px 0;
  transition: all 1s;
  &:hover {
    transform: scale(1.2);
  }
}
.title {
  margin: 15px 10px;
  font-size: 14px;
}
.foot-btn {
  padding: 20px 0;
}
.devices-box,.col-container {
  padding: 0 50px;
}
.map-place {
  height: 300px;
  width: 400px;
  position: relative;
  .input-box {
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 667;
    padding: 10px;
    font-size: 12px;
    background-color: #fff;
    .key-word {
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-right: none;
    }
    .native-input, .key-word{
      box-sizing: border-box;
      height: 24px;
      padding: 2px;
    }
  }
}
.op-icon {
  display: block;
  width: 60px;
  .iconfont {
    font-size: 22px;
    color: @sys-main-header;
    line-height: 28px;
    padding: 0 2px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
      transform: scale(1.2);
      transform-origin: center;
    }
  }
}
.el-icon-error {
  font-size: 20px;
  line-height: 28px;
  padding: 0 2px;
  color: #F56C6C;
}
.equipment {
  display: flex;
  align-items: center;
}
.el-add-icon {
  text-indent: 0px;
  font-size: 18px;
  color: @sys-main-header;
  padding: 0 2px;
  margin-left: 20px;
  cursor: pointer;
  transition: all .5s;
  &:hover {
    transform: scale(1.5);
    transform-origin: center;
  }
}
.sn-key {
  color: #F56C6C;
  padding: 5px 10px;
}
.chooseMap-btn {
  position: absolute;
  top: 0;
  right: -35px;
}
</style>
