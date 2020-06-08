
<template>
<!-- eslint-disable vue/valid-v-bind -->
  <div style="position:relative">
  <!--  自定义表头显示项目数 -->
    <el-popover popper-class="tableBtn-popper" v-if="checked">
      <ul>
        <li v-for="(value,key) in tableHeadData" :key="'index' + key">
          <el-checkbox v-model="value.checked" size="mini">{{value.label}}</el-checkbox>
        </li>
      </ul>
      <el-button class="poper-btn" slot="reference" icon="el-icon-s-grid" plain size="mini"></el-button>
    </el-popover>
    <!--  公共table列表 -->
    <el-table ref="commonTable"
      @select="selectSingleBox"
      @select-all="selectAllBox"
      @row-click="selectRow"
      :data="tableList"
      :[tableHeight.prop]="tableHeight.value"
      size="mini"
      highlight-current-row
      :border="border">
      <el-table-column v-if="selectBox" type="selection" align="center" width="40"></el-table-column>
      <el-table-column v-if="showNum" type="index" width="50" label="NO." align="center"></el-table-column>
      <template v-for="(item,index) in trueTableHead">
        <el-table-column
          show-overflow-tooltip
          v-if="!item.slotName"
          :key="'table' + index"
          :fixed="item.fixed || false"
          :prop="item.prop || ''"
          :label="$t(item.label)"
          :align="item.align || 'center'"
          :[widthMethod(item.width)]="item.width || '80'"
          :render-header="item.renderHeader ? renderHead : renderCommon"
        ></el-table-column>
        <el-table-column v-else
          show-overflow-tooltip
          :key="'table' + index"
          :fixed="item.fixed || false"
          :prop="item.prop || ''"
          :label="$t(item.label)"
          :align="item.align || 'center'"
          :min-width="item.width || '80'"
          :render-header="item.renderHeader ? renderHead : renderCommon">
          <template slot-scope="scope">
            <!-- 具名插槽 -->
            <slot :name="item.slotName || 'default'" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
/**
 *  @param :
 *  1. clearSelection --- 如果传过来的值是true时,清空所有选项,然后会自动改变父组件的值为false
 *  2. tableList -- 表格数据列表
 *  3. tableHeadData -- 表格表头数据
 *  4. selectBox --- 是否显示勾选框
 *  5. border --- 是否显示边框
 *  7. showNum -- 是否显示序号
 *  9. selectSingle -- 表格是否为单选
 *  10. tableHeight -- 表格高度 如果传入Height 定高, 否则自动设置成最大高
 *  11. widthMethod -- 如果设置了item.width 列宽 则定宽, 否则自动设置成最小宽度
*/
export default {
  name: 'common-table',
  data () {
    return {
      selection: [],
      widthMethod (prop, value) {
        return prop ? 'width' : 'min-width'
      }
    }
  },
  props: {
    maxHeight: {
      default () {
        return window.innerHeight - this.$store.state.tableH
      }
    },
    height: {
      default: ''
    },
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    border: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    checked: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    clearSelection: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    selectBox: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showNum: {
      type: Boolean,
      default: false
    },
    tableHeadData: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectSingle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    trueTableHead () {
      return this.tableHeadData.filter(v => v.checked)
    },
    tableHeight () {
      if (this.height) {
        return {
          prop: 'height',
          value: this.height
        }
      }
      return {
        prop: 'max-height',
        value: this.maxHeight
      }
    }
  },
  watch: {
    clearSelection: function (newData) {
      if (typeof newData === 'boolean' && newData) {
        newData && this.$refs['commonTable'].clearSelection()
        this.$emit('update:clearSelection', false)
      }
    }
  },
  mounted () {
    // this.list(this.pageParams);
  },
  methods: {
    selectSingleBox (selection, row) {
      if (this.selectSingle) {
        // 设置为单选
        this.selection = [row]
        this.$refs['commonTable'].clearSelection()
        this.$refs['commonTable'].toggleRowSelection(row, true)
      } else {
        this.selection = selection
      }
      this.$emit('select', selection, row)
    },
    // 勾选选择框
    selectAllBox (selection) {
      if (this.selectSingle) {
        this.$refs['commonTable'].clearSelection()
        this.selection = []
      } else {
        this.selection = selection
      }
      this.$emit('select', this.selection)
    },
    // 点击表格行
    selectRow (row) {
      let index = this.selection.indexOf(row)
      if (this.selectSingle) {
        if (index > -1) {
          this.$refs['commonTable'].toggleRowSelection(row, false)
          this.selection = []
        } else {
          this.selection = [row]
          this.$refs['commonTable'].clearSelection()
          this.$refs['commonTable'].toggleRowSelection(row, true)
        }
        this.$emit('select', this.selection)
        return
      }
      if (index > -1) {
        // 当前的行已经被选中了
        this.selection.splice(index, 1)
        this.$refs['commonTable'].toggleRowSelection(row, false)
      } else {
        this.$refs['commonTable'].toggleRowSelection(row, true)
        this.selection.push(row)
      }
      this.$emit('select', this.selection)
    },
    // 定义表头溢出省略号
    renderHead (h, { column }) {
      return (
        <el-tooltip
          class="text-cut"
          effect="dark"
          content={column.label}
          placement="top"
        >
          <div>{column.label}</div>
        </el-tooltip>
      )
    },
    // 普通显示
    renderCommon (h, { column }) {
      return column.label
    }
  }
}
</script>
<style scoped lang="less">

</style>
