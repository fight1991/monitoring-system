<template>
  <section class="sys-main bg-c" v-setH:min="setDivH">
    <el-form size="mini" :model="dataForm" ref="dataForm" :rules="rules" label-position="left" label-width="120px">
      <div class="top" v-if="access > 1">
        <div class="title border-line">{{$t('plant.plantSet')}}</div>
          <div class="col-container">
            <el-row :gutter="40">
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('join.agent')" prop="agent">
                  <el-select v-model="dataForm.agent" style="width:100%" :placeholder="$t('common.select')">
                    <el-option v-for="(item, index) in agentList" :key="'index' + index" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.name')" prop="details.name">
                  <el-input v-model="dataForm.details.name" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.type')" prop="details.type">
                  <el-select v-model="dataForm.details.type" style="width:100%" :placeholder="$t('common.select')">
                    <el-option :label="$t('common.light')" :value="1" key="1"></el-option>
                    <el-option :label="$t('common.energy')" :value="2" key="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.country')" prop="details.country">
                  <el-select v-model="dataForm.details.country" filterable style="width:100%" @change="getZoneList" :placeholder="$t('common.select')">
                    <el-option v-for="item in countryList" :key="item.code" :value="item.name" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.city')" prop="details.city">
                  <el-input v-model="dataForm.details.city" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.address')" prop="details.address">
                  <el-input v-model="dataForm.details.address" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('common.zone')" prop="timezone">
                  <el-select v-model="dataForm.timezone" filterable :disabled="!zoneIsShow" style="width:100%" :placeholder="$t('common.select')">
                    <el-option v-for="item in zoneInfo.timezones" :key="item" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24" v-if="hasSummerTime">
                <el-form-item :label="$t('plant.summerTime')" prop="daylight">
                  <el-select v-model="dataForm.daylight" filterable style="width:100%" :placeholder="$t('common.select')">
                    <el-option v-for="item in zoneInfo.daylights" :key="item" :value="item" :label="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('common.postcode')" prop="details.postcode">
                  <el-input v-model="dataForm.details.postcode" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('plant.price')" prop="details.price">
                  <el-select v-model="dataForm.details.price" style="width:100%" :placeholder="$t('common.select')">
                    <el-option v-for="item in powerList" :key="item.id" :value="item.name" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12" :md="24">
                <el-form-item :label="$t('common.pvcapacity')" prop="details.systemCapacity">
                  <el-input v-model="dataForm.details.systemCapacity" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
      </div>
      <div class="title equipment border-line">{{$t('plant.epBind')}} <i class="el-add-icon el-icon-circle-plus-outline" @click="deviceAdd"></i></div>
      <div class="col-container devices">
        <el-row :gutter="40" v-for="(item, index) in dataForm.devices" :key="'index'+index">
          <!-- validator: (rule, value, callback)=>{checkSN(rule, value, callback, 'sn')} -->
          <el-col :span="12">
            <el-form-item :label="$t('plant.sn')" :prop="'devices.'+index+'.sn'" :rules="{required:true, message: 'sn is invalid', trigger: 'blur'}">
              <el-input v-model="item.sn" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="padding-left:0px">
            <span class="op-icon">
              <i class="iconfont icon-delete" @click="deviceDelete(index)"></i>
              <!-- <i class="fr iconfont icon-add" @click="deviceAdd" v-show="index==0"></i> -->
              <!-- v-show="!(index==0 && deleteBtn)" -->
              <i class="el-icon-error" v-show="item.isPass === 0"></i>
            </span>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-row class="foot-btn" type="flex" justify="center" v-if="opType!=='look'">
      <el-button size="mini" @click="cancel">{{$t('plant.cancel')}}</el-button>
      <el-button size="mini" @click="confirmBtn" type="primary">{{opType=='add'?$t('plant.new'):$t('plant.edit')}}</el-button>
    </el-row>
    <el-dialog
      title="Error List"
      width="300px"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="errVisible">
      <div v-for="(item, index) in errorList" :key="'index'+index">
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
export default {
  data () {
    return {
      opType: 'add', // 记录操作类型 add创建, look查看 edit编辑
      plantId: '', // 电站id
      snIsPass: true,
      errVisible: false,
      snResult: [], // sn校验的结果
      agentList: [],
      zoneInfo: { // 时区信息
        useDaylight: false,
        timezones: [],
        daylights: []
      },
      countryList: [], // 国家列表
      dataForm: {
        devices: [
          { sn: '', key: '', isPass: 1 }
        ],
        timezone: '',
        daylight: '',
        agent: '',
        details: {
          name: '',
          type: '',
          country: '',
          city: '',
          address: '',
          price: '',
          capacity: '',
          quantity: '',
          stationID: '',
          owner: '',
          createdDate: '',
          postcode: '',
          systemCapacity: ''
        }
      },
      templateDevice: {
        sn: '',
        key: '',
        isPass: 1
      },
      editInfo: {},
      rules: {
        agent: [{ required: true, message: 'agent is required', trigger: 'change' }],
        timezone: [{ required: true, message: 'time zone is required', trigger: 'change' }],
        daylight: [{ required: true, message: 'summer time is required', trigger: 'change' }],
        'details.name': [{ required: true, message: 'name is required', trigger: 'blur' }],
        'details.type': [{ required: true, message: 'type is required', trigger: 'blur' }],
        'details.country': [{ required: true, message: 'country is required', trigger: 'change' }],
        'details.city': [{ required: true, message: 'city is required', trigger: 'blur' }],
        'details.address': [{ required: true, message: 'address is required', trigger: 'blur' }],
        'details.price': [{ required: true, message: 'price is required', trigger: 'change' }],
        'details.systemCapacity': [{ required: true, message: 'capacity is required', trigger: 'blur' }],
        'details.postcode': [{ required: true, message: 'postcodes is required', trigger: 'blur' }]
      },
      powerList: [
        { id: '3', name: 'CNY' }
      ]
    }
  },
  async created () {
    if (this.access > 1) {
      this.getPriceList()
      this.getAgentList()
      this.countryList = await this.getCountryList()
    }
    let { opType } = this.$route.meta
    if (opType) {
      this.opType = opType || this.$route.query.opType
    }
    if (this.opType !== 'add') {
      this.plantId = this.$route.query.plantId
      this.getStationInfo(this.plantId)
    }
  },
  watch: {
    '$store.state.lang': async function () {
      this.countryList = await this.getCountryList()
    }
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
      return this.zoneInfo.useDaylight
    }
  },
  methods: {
    // 表格模板
    copyData () {
      return {
        devices: [
          { sn: '', key: '', isPass: 1 }
        ],
        timezone: '',
        daylight: '',
        agent: '',
        details: {
          name: '',
          type: '',
          country: '',
          city: '',
          address: '',
          price: '',
          capacity: '',
          quantity: '',
          stationID: '',
          owner: '',
          createdDate: '',
          postcode: '',
          systemCapacity: ''
        }
      }
    },
    // 设备新增
    deviceAdd () {
      this.dataForm.devices.push({ ...this.templateDevice })
    },
    // 获取代理商列表
    async getAgentList () {
      let { result } = await this.$axios({
        url: '/v0/user/agents'
      })
      if (result) {
        this.agentList = result.agents || []
        // 设置默认值
        this.dataForm.agent = result.default || ''
      }
    },
    // 获取电价列表
    async getPriceList () {
      let { result } = await this.$axios({
        url: '/v0/plant/earnings/pricelist'
      })
      if (result && result.length > 0) {
        this.powerList = result
      }
    },
    // 获取时区列表
    async getZoneList (name) {
      let temp = this.countryList.find(v => v.name === name)
      let { result } = await this.$axios({
        url: '/v0/map/timezones',
        data: {
          country: temp.code
        }
      })
      if (result) {
        this.zoneInfo = result
      }
    },
    // 设备删除
    async deviceDelete (index) {
      if (index === 0 && this.dataForm.devices.length === 1) {
        if (this.dataForm.devices[0].sn) {
          let res = await this.$confirm(this.$t('common.tips2'), this.$t('common.tip'), {
            confirmButtonText: this.$t('common.confirm'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => true).catch(() => false)
          if (!res) return
        }
        this.dataForm.devices = [{ ...this.templateDevice }]
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
      if (this.opType === 'edit') {
        this.dataForm = this.editInfo
      } else {
        this.dataForm = this.copyData()
      }
      this.$refs.dataForm.clearValidate()
    },
    // 新建电站 / 编辑电站
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
    // 创建电站
    creatPlant () {
      let url = this.opType === 'add' ? '/v0/plant/create' : '/v0/plant/update'
      if (!this.hasSummerTime) {
        this.dataForm.daylight = ''
      }
      this.$post({
        url: url,
        data: {
          ...this.dataForm
        },
        success: ({ result }) => {
          this.$message.success(this.$t('common.success'))
          this.$tab.back({
            name: 'bus-plant-view'
          })
        }
      })
    },
    // 远程校验sn 任意一对sn-key验证通过都可创建成功,全部sn-key失败则创建失败
    async remoteSN (item) {
      let { result, other } = await this.$axios({
        method: 'post',
        url: '/v0/module/checksn',
        data: {
          type: this.access === 1 ? 0 : this.opType === 'add' ? 1 : 2,
          devices: item,
          stationID: this.plantId
        }
      })
      this.snResult = result || other || []
      return true
    },
    // 查询电站信息
    async getStationInfo (stationID) {
      let { result } = await this.$axios({
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
      } else {
        this.dataForm = this.copyData()
      }
      this.editInfo = JSON.parse(JSON.stringify(this.dataForm))
      return true
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  margin: 15px 10px;
}
.foot-btn {
  margin: 20px 0;
}
.col-container {
  padding: 0 50px;
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
