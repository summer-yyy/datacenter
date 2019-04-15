<template>
  <div class="list">
    <!-- 控制按钮 -->
    <!-- <div class="controlBox">
      <Button type="info" style="width: 90px;" @click="handleAdd">新增</Button>
    </div> -->
    <!-- 列表 -->
    <TableList :hasPage="false" style="margin: 0;" :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange" @selectionChange="selectionChange">
      <template slot-scope="{ row, index }" slot="radio">
        <Radio :label="row.objectName"><span></span></Radio>  
      </template>
      <template slot-scope="{ row, index }" slot="sourceField">
        <Select v-model="tableData[index].sourceField" @on-change="sourcefieldChange(row, index)">
          <Option v-for="option in sourceTableFields" :label="option.field" :value="option.field" :key="option.field"></Option>
        </Select>
      </template>
      <template slot-scope="{ row, index }" slot="targetField">
        <Select v-model="tableData[index].targetField" @on-change="targetFieldChange(row, index)">
          <Option v-for="option in targetTableFields" :label="option.field" :value="option.field" :key="option.field"></Option>
        </Select>
      </template>
      <template slot-scope="{ row, index }" slot="mappingRule">
        <span>{{row.mappingRule}}</span><Icon type="ios-create-outline" @click="editRule(row.mappingRule, index)"/>
      </template>
    </TableList>
    <!-- 数据库表字段-->
    <Modal
        v-model="isRuleConfigShow"
        :mask-closable="false"
        title=" "
        width="500"
        @on-ok=""
        @on-cancel=""
        :transfer="false">
        <RuleConfig v-if="isRuleConfigShow" v-model="ruleStr" ref="rule"/>
        <div slot="footer" style="text-align: right;">
            <Button @click="isRuleConfigShow=false">取消</Button>
            <Button style="margin-left: 20px;" type="primary" @click="save">保存</Button>
        </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
    Search: r => require.ensure([], () => r(require('@/components/Search/Search.vue'))),
    TableList: r => require.ensure([], () => r(require('@/components/TableList/TableList.vue'))),
    RuleConfig: r => require.ensure([], () => r(require('./RuleConfig.vue'))),
  },
})
export default class List extends Vue {
  @Prop({
    type: Object,
    default () {
      return {};
    }
  })
  params: object;
  @Prop({
    type: Array,
    default () {
      return [];
    }
  })
  fieldMappings: any[];
  isRuleConfigShow = false
  ruleStr = ""
  columns = [
      // {
      //   type: 'selection',
      //   width: 60,
      //   align: 'center'
      // },
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
        title: '源字段',
        slot: 'sourceField'
      },
      {
        title: '源字段类型',
        key: 'sourceFieldType'
      },
      {
        title: '目标字段',
        slot: 'targetField'
      },
      {
        title: '目标字段类型',
        key: 'targetFieldType'
      },
      {
        title: '映射规则',
        slot: 'mappingRule'
      },
  ]
  tableData = []
  sourceTableFields = []
  targetTableFields = []
  pageConfig = {
      "page": 1,
      "totalPage": 1,
      "totalCount": 100,
      "pageSize": 10
  }
  data = {
    sourceCatalogSchema: '',
    sourceDatasourceType: '',
    sourceDatasourceId: '',
    sourceTableName: '',
    targetCatalogSchema: '',
    targetDatasourceType: '',
    targetDatasourceId: '',
    targetTableName: '',
  }
  handleAdd () {
    
  }
  sourcefieldChange (row, index) {
    this.tableData[index].sourceFieldType = this.sourceTableFields.find(item => item.field == this.tableData[index].sourceField).type;
  }
  targetFieldChange (row, index) {
    this.tableData[index].targetFieldType = this.targetTableFields.find(item => item.field == this.tableData[index].targetField).type;
  }
  editRule (rules, index) {
    this.current = index;
    this.ruleStr = rules;
    this.isRuleConfigShow = true;
  }
  getList (data) {
    urlList.dataExchange.dbTableFieldList(Object.assign(data, this.params)).then(res => { // sueccess 回调
      this.sourceTableFields = res.data.tableFields.sourceTableFields;
      this.targetTableFields = res.data.tableFields.targetTableFields;
      if (this.fieldMappings && this.fieldMappings.length > 0){
        this.tableData = JSON.parse(JSON.stringify(this.fieldMappings));
      } else{
        let tableLength = Math.max(this.sourceTableFields.length, this.targetTableFields.length);
        for (let i = 0; i < tableLength; i++) {
          this.tableData.push({
            sourceField: this.sourceTableFields[i] && this.sourceTableFields[i].field,
            sourceFieldType: this.sourceTableFields[i] && this.sourceTableFields[i].type,
            targetField: this.targetTableFields[i] && this.targetTableFields[i].field,
            targetFieldType: this.targetTableFields[i] && this.targetTableFields[i].type,
            mappingRule: ""
          })
        }
      }      
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  pageChange (page) {
    console.log("pageChange")
    this.pageConfig.page = page;
    this.getList()
  }
  pageSizeChange (pageSize) {
    console.log("pageSizeChange")
    this.pageConfig.page = 1;
    this.pageConfig.pageSize = pageSize;
    this.getList();
  }
  selectionChange (list) {
    console.log(list)
  }
  save () {
    this.$refs.rule.updateRules();
    console.log(this.ruleStr);
    this.tableData[this.current].mappingRule = this.ruleStr;
    this.isRuleConfigShow = false;
  }
  updateFields () {
    return this.tableData;
  }
  created () {
    this.getList(this.data);
  }
  
}
</script>

<style lang="less" scoped>
  @import '../../../assets/less/public';
  .list {
    display: flex;
    flex: 1;
    flex-direction: column;    
    .controlBox {
      padding: 0 24px;
    }
  }
</style>
