<template>
  <section class="sys-main bg-c" v-setH:min="setDivH">
    <div class="remote-set-tab">
      <el-tabs type="card" tab-position="left" v-model="tabName">
        <el-tab-pane v-for="item in tabList" :key="item.key" :label="item.name" :name="item.key">
          <common-form :formItems="item.properties" :keyWord="item.key" :id="id"></common-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import commonForm from './components/commonForm'
export default {
  components: { commonForm },
  data () {
    return {
      id: '',
      tabName: '1',
      /* eslint-disable */
      tabList: [{
        "name": "StartParameters",
        "key": "para.0",
        "properties": [{
          "name": "ConnectTime",
          "key": "prop111",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 15,
            "hi": 300
          },
          "unit": "S"
        }, {
          "name": "LoadSpeed",
          "key": "prop112",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 0,
            "hi": 1000
          },
          "unit": "1%/min"
        }, {
          "name": "ReconnectTime",
          "key": "prop113",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 0,
            "hi": 60000
          },
          "unit": "S"
        }, {
          "name": "ReloadSpeed",
          "key": "prop114",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 0,
            "hi": 1000
          },
          "unit": "1%/min"
        }, {
          "name": "VgridBackHigh",
          "key": "prop115",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 2000,
            "hi": 3000
          },
          "unit": "V"
        }, {
          "name": "VgridBackLow",
          "key": "prop116",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 500,
            "hi": 2200
          },
          "unit": "V"
        }, {
          "name": "FgridBackHigh",
          "key": "prop117",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 4500,
            "hi": 6500
          },
          "unit": "Hz"
        }, {
          "name": "FgridBackLow",
          "key": "prop118",
          "elemType": {
            "valueType": "uint16",
            "uiType": "input",
            "uiItems": null
          },
          "range": {
            "enable": true,
            "lo": 4500,
            "hi": 6500
          },
          "unit": "Hz"
        }, {
          "name": "test_switch0",
          "key": "prop119",
          "elemType": {
            "valueType": "bool",
            "uiType": "switch",
            "uiItems": null
          },
          "range": {
            "enable": false,
            "lo": 0,
            "hi": 0
          },
          "unit": ""
        }, {
          "name": "test_switch1",
          "key": "prop120",
          "elemType": {
            "valueType": "bool",
            "uiType": "switch",
            "uiItems": null
          },
          "range": {
            "enable": false,
            "lo": 0,
            "hi": 0
          },
          "unit": ""
        }, {
          "name": "test_select0",
          "key": "prop121",
          "elemType": {
            "valueType": "string",
            "uiType": "select",
            "uiItems": ["A", "B", "C", "D"]
          },
          "range": {
            "enable": false,
            "lo": 0,
            "hi": 0
          },
          "unit": ""
        }]
      }]
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getTabList()
  },
  methods: {
    async getTabList () {
      let { result } = await this.$axios({
        url: '/v0/device/setting/ui',
        data: {
          id: this.id
        }
      })
      if (result) {
        this.tabList = result.parameters || []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.remote-set-tab {
  padding: 30px 0 30px 30px;
}
</style>
