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
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.country')" prop="details.country">
                <el-input disabled v-model="dataForm.details.country"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.country')" prop="details.country">
                <el-select v-model="dataForm.details.country" filterable style="width:100%" @change="getZoneList" :placeholder="$t('common.select')">
                  <el-option v-for="item in countryList" :key="item.code" :value="item.name" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.city')" prop="details.city">
                <el-input disabled v-model="dataForm.details.city"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('plant.address')" prop="details.address">
                <el-popover
                  @show="importMap()"
                  popper-class="map-popper"
                  placement="bottom"
                  :trigger="endUserNoUse && inputController ? 'no' : 'click'">
                  <el-input slot="reference" :disabled="endUserNoUse && inputController" class="no-bg" v-model="dataForm.details.address" readonly :placeholder="$t('plant.searchP')">
                    <span slot="suffix" v-show="!(endUserNoUse && inputController)"><i class="map-icon el-icon-location-information"></i></span>
                  </el-input>
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
                  <span slot="suffix">/kWh</span>
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
    </el-form>
    <el-row class="foot-btn" type="flex" justify="center" v-if="opType!=='look'">
      <el-button size="mini" @click="cancel">{{$t('plant.cancel')}}</el-button>
      <el-button size="mini" @click="confirmBtn" type="primary">{{opType=='add'?$t('plant.new'):$t('plant.edit')}}</el-button>
    </el-row>
    <el-dialog
      :title="$t('common.list')"
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
      copyDataForm: {},
      templateDevice: {
        sn: '',
        key: '',
        isPass: 1
      },
      rules: {},
      currencyList: []
    }
  },
  async created () {
    this.opType = this.$route.meta.opType
    if (this.opType === 'edit') {
      this.plantId = this.$route.query.plantId
      this.isSelectMap = true
      this.getStationInfo(this.plantId)
    }
    if (this.access > 1) {
      this.rules = this.setFormRules(true)
      await this.getCurrencyList()
      await this.getAgentList()
      // this.countryList = await this.getCountryList()
      if (this.opType === 'add') {
        this.dataForm.details.currency = this.currencyList[0] || ''
      }
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
      return this.dataForm.details.address && this.zoneInfo.timezones && this.zoneInfo.timezones.length > 0
    },
    hasSummerTime () { // 是否有夏令时
      return this.zoneInfo.useDaylight
    },
    endUserNoUse () {
      return this.access === 1
    }
  },
  methods: {
    // 设置校验规则
    setFormRules (isRequired = false) {
      return {
        agent: [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        timezone: [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        daylight: [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.name': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.type': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        'details.country': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
        'details.city': [{ required: isRequired, message: this.messageValid('require'), trigger: 'blur' }],
        'details.address': [{ required: isRequired, message: this.messageValid('require'), trigger: 'change' }],
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
    // 获取代理商列表
    async getAgentList () {
      let { result } = await this.$get({
        url: '/v0/user/agents'
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
        url: '/v0/plant/earnings/currency'
      })
      if (result && result.length > 0) {
        this.currencyList = result
      }
      return true
    },
    // 获取时区列表
    async getZoneList (shortName) {
      this.dataForm.timezone = ''
      this.dataForm.daylight = ''
      let { result } = await this.$get({
        url: '/v0/map/timezones',
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
      let res = await this.$confirm(this.$t('common.tips2') + ' ' + sn, this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => true).catch(() => false)
      if (!res) return
      if (index === 0 && this.dataForm.devices.length === 1) {
        if (this.dataForm.devices[0].sn) {
          this.dataForm.devices = [{ ...this.templateDevice }]
        }
      } else {
        this.dataForm.devices.splice(index, 1)
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
      this.creatPlant()
    },
    // 取消按钮
    async cancel () {
      let res = await this.$confirm(this.$t('common.tips1'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => true).catch(() => false)
      if (!res) return
      this.dataForm = JSON.parse(JSON.stringify(this.copyDataForm))
      this.$refs.dataForm.clearValidate()
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
        this.creatPlant()
        return
      }
      // 有的sn校验失败显示弹框
      if (!this.isAllError && !this.isAllPass && this.snResult.length > 0) {
        this.errVisible = true
      }
    },
    // 新建电站 / 编辑电站
    async creatPlant () {
      let url = this.opType === 'add' ? '/v0/plant/create' : '/v0/plant/update'
      if (!this.hasSummerTime) {
        this.dataForm.daylight = ''
      }
      let { result } = await this.$post({
        url: url,
        data: {
          ...this.dataForm
        }
      })
      if (result) {
        this.$message.success(this.$t('common.success'))
        let backName = 'bus-plant-view'
        if (this.$route.meta.title === 'plantL') {
          backName = 'bus-data-view'
        }
        this.$tab.back({
          name: backName
        })
      }
    },
    // 远程校验sn 任意一对sn-key验证通过都可创建成功,全部sn-key失败则创建失败
    async remoteSN (item) {
      let { result, other } = await this.$post({
        url: '/v0/module/checksn',
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
        url: '/v0/plant/get',
        data: {
          stationID
        }
      })
      if (result) {
        if (!result.devices) {
          result.devices = [this.templateDevice]
        }
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

</style>
