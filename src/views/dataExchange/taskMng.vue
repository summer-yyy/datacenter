<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <!-- 控制按钮 -->
    <div class="controlBox">
      <Button type="info" style="width: 90px;" @click="handleAdd">+实时</Button>
    </div>
    <!-- 列表 -->
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="handleEdit(row, index)" :disabled="row.taskStatus != 3">编辑</Button>
        <Button @click="handleSwitch(row, index)" style="margin-left: 10px;">{{row.taskStatus == 1 ? "停用" : "启用"}}</Button>
        <Button @click="handleDel(row, index)"  :disabled="row.taskStatus != 3" style="margin-left: 10px;">删除</Button>
      </template>
    </TableList>
    <!-- 新增弹窗 -->
    <Modal
        v-model="isModalShow"
        title=" "
        :mask-closable="false"
        width="900"
        @on-ok="addInfo"
        @on-cancel=""
        :transfer="false">
        <Form ref="infoForm" :model="infoData" :rules="rules" label-position="right" :label-width="100">
            <div class="content">
              <div class="top">
                <FormItem prop="taskName" label="名称：">
                    <Input type="text" v-model="infoData.taskName">
                    </Input>
                </FormItem>
                <FormItem prop="nodeTaskId" label="任务节点：">
                  <Select v-model="infoData.nodeTaskId" style="width: 162px;">
                    <Option v-for="option in taskNodeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem prop="regionId" label="所属域：">
                  <Select v-model="infoData.regionId" style="width: 162px;">
                    <Option v-for="option in regionList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                  </Select>
                </FormItem>
              </div>
              <Divider />
              <Form ref="taskAdapter" :model="taskAdapter" :rules="rules" label-position="right" :label-width="100">

                <div class="middle">
                  <div class="item">
                    <FormItem prop="sourceDatasourceType" label="数据源类型：">            
                      <Select v-model="taskAdapter.sourceDatasourceType" @on-change="dbTypeChange1">
                        <Option v-for="option in dbTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem prop="sourceDatasourceId" label="输入数据源：">
                        <Select v-model="taskAdapter.sourceDatasourceId" @on-change="taskAdapter.sourceTableName = ''">
                          <Option v-for="option in dataSourceList1" :value="option.value" :key="option.value">{{ option.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="sendNumber" label="单次提取条数：">
                        <Input type="text" v-model="taskAdapter.sendNumber">
                        </Input>
                    </FormItem>
                  </div>
                  <div class="control"></div>
                  <div class="item">
                    <FormItem prop="targetDatasourceType" label="数据源类型：">            
                      <Select v-model="taskAdapter.targetDatasourceType" @on-change="dbTypeChange2">
                        <Option v-for="option in dbTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem prop="targetDatasourceId" label="输出数据源：">
                        <Select v-model="taskAdapter.targetDatasourceId" @on-change="taskAdapter.targetTableName = ''">
                          <Option v-for="option in dataSourceList2" :value="option.value" :key="option.value">{{ option.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="receiveNumber" label="单次加载条数：">
                        <Input type="text" v-model="taskAdapter.receiveNumber">
                        </Input>
                    </FormItem>
                  </div>
                </div>
                <div class="bottom">
                  <div class="item left">
                    <Tooltip :content="taskAdapter.sourceTableName || '请选择'">
                      <Button type="info" style="width: 120px; height: 50px;text-overflow:ellipsis;overflow: hidden;" @click="isDbTableShow1=true" :disabled="taskAdapter.sourceDatasourceType=='' || taskAdapter.sourceDatasourceId==''">{{taskAdapter.sourceTableName || "请选择"}}</Button> 
                    </Tooltip>  
                  </div>
                  <div class="control">
                    <Button @click="isDbFieldShow = true" :disabled="taskAdapter.targetTableName=='' || taskAdapter.sourceTableName==''">字段映射</Button>
                    <div class="arrow">
                    </div>
                  </div>
                  <div class="item right">
                    <Tooltip :content="taskAdapter.targetTableName || '请选择'">
                      <Button type="info" style="width: 120px; height: 50px;text-overflow:ellipsis;overflow: hidden;" @click="isDbTableShow2=true" :disabled="taskAdapter.targetDatasourceType=='' || taskAdapter.targetDatasourceId==''">{{taskAdapter.targetTableName || "请选择"}}</Button>
                    </Tooltip> 
                  </div>
                </div>
              </Form>

            </div>
            

        </Form>
        <!-- <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
        </div> -->
    </Modal>
    <!-- 数据库表-->
    <Modal
        v-model="isDbTableShow1"
        title=" "
        :mask-closable="false"
        width="900"
        @on-ok=""
        @on-cancel=""
        :transfer="false">
        <DbTableList v-if="isDbTableShow1" :datasourceType="taskAdapter.sourceDatasourceType" :datasourceId="taskAdapter.sourceDatasourceId" @on-change="dbTableChange1"/>
        <div slot="footer" style="text-align: right;">
            <Button @click="isDbTableShow1=false">取消</Button>
            <Button style="margin-left: 20px;" type="primary" @click="dbTableSave1">保存</Button>
        </div>
    </Modal>
    <!-- 数据库表-->
    <Modal
        v-model="isDbTableShow2"
        title=" "
        :mask-closable="false"
        width="900"
        @on-ok=""
        @on-cancel=""
        :transfer="false">
        <DbTableList v-if="isDbTableShow2" :datasourceType="taskAdapter.targetDatasourceType" :datasourceId="taskAdapter.targetDatasourceId" @on-change="dbTableChange2"/>
        <div slot="footer" style="text-align: right;">
            <Button @click="isDbTableShow2=false">取消</Button>
            <Button style="margin-left: 20px;" type="primary" @click="dbTableSave2">保存</Button>
        </div>
    </Modal>
    <!-- 数据库表字段-->
    <Modal
        v-model="isDbFieldShow"
        :mask-closable="false"
        title=" "
        width="900"
        @on-ok=""
        @on-cancel=""
        :transfer="false">
        <DbTableFieldList v-if="isDbFieldShow" ref="dbField" :params="taskAdapter" :fieldMappings="fieldMappings"/>
        <div slot="footer" style="text-align: right;">
            <Button @click="isDbFieldShow=false">取消</Button>
            <Button style="margin-left: 20px;" type="primary" @click="saveDbField">保存</Button>
        </div>
    </Modal>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
    Search: r => require.ensure([], () => r(require('@/components/Search/Search.vue'))),
    TableList: r => require.ensure([], () => r(require('@/components/TableList/TableList.vue'))),
    DbTableList: r => require.ensure([], () => r(require('./components/DbTableList.vue'))),
    DbTableFieldList: r => require.ensure([], () => r(require('./components/DbTableFieldList.vue'))),
  },
})
export default class List extends Vue {
  isModalShow = false
  isDbTableShow1 = false
  isDbTableShow2 = false
  isDbFieldShow = false
  searchData = [{
    type: 1,
    value: "",
    prop: "taskName",
    name: "任务名称"
  },{
    type: 2,
    value: "",
    prop: "regionId",
    name: "所属域",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "taskType",
    name: "任务类型",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "taskStatus",
    name: "任务状态",
    dataList: []
  },]
  columns = [
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '任务名称',
          key: 'taskName'
      },
      {
          title: '所属域',
          key: 'regionName'
      },
      {
          title: '所属任务节点',
          key: 'nodeTaskName'
      },
      {
          title: '任务类型',
          key: 'taskTypeName'
      },
      {
          title: '任务状态',
          key: 'taskStatusName'
      },
      {
          title: '创建时间',
          key: 'createTime'
      },
      {
        title: '操作',
        slot: 'action',
        width: 250     
      }
  ]
  infoData = {
    id: "",
    "taskName": "",
    "taskType": "2",
    "nodeTaskId": "",
    "regionId": "",
  }
  taskAdapter = {
    "sourceDatasourceId": "",
    "sendNumber": "",
    "targetDatasourceId": "",
    "receiveNumber": "",
    "sourceTableName": "",
    "targetTableName": "",
    sourceDatasourceType: "",
    targetDatasourceType: "",
  }
  fieldMappings = []
  rules = {}
  taskNodeList = []
  regionList = []
  dbTypeList = []
  dataSourceList1 = []
  dataSourceList2 = []
  tableData = []
  pageConfig = {
      "page": 1,
      "totalPage": 1,
      "totalCount": 100,
      "pageSize": 10
  }
  search (data) {
    this.pageConfig.page = 1;
    this.getList(data);
  }
  getList (data = this.formData) {
    urlList.dataExchange.list(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
      this.tableData = res.data.dataList;
      this.pageConfig = res.data.pageConfig;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  get formData () {
    let data = {};
    this.searchData.forEach(item => {
      data[item.prop] = item.value;
    });
    return data;
  }
  dbTableChange1 (list) {
    this.sourceTableName = list.split(",")[0];
    this.sourceCatalogSchema = list.split(",")[1];
  }
  dbTableChange2 (list) {
    this.targetTableName = list.split(",")[0];
    this.targetCatalogSchema = list.split(",")[1];
  }
  dbTableSave1 () {
    this.taskAdapter.sourceTableName = this.sourceTableName;
    this.taskAdapter.sourceCatalogSchema = this.sourceCatalogSchema;
    this.fieldMappings = []
    this.isDbTableShow1=false
  }
  dbTableSave2 () {
    this.taskAdapter.targetTableName = this.targetTableName;
    this.taskAdapter.targetCatalogSchema = this.targetCatalogSchema;
    this.fieldMappings = []
    this.isDbTableShow2=false
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
  handleAdd () {
    this.$refs.infoForm.resetFields();
    this.$refs.taskAdapter.resetFields();
    this.infoData.id = "";
    this.infoData.taskType = "2";
    this.taskAdapter.sourceTableName = "";
    this.taskAdapter.targetTableName = "";
    this.isModalShow = true;
  }
  handleEdit (row, index) {
    console.log(row, index)
    this.isModalShow = true;
    urlList.dataExchange.detail({id: row.id}).then(res => { // sueccess 回调
      this.infoData = res.data.taskDetail;
      this.fieldMappings = this.infoData.fieldMappings;
      this.taskAdapter = this.infoData.taskAdapter;
      this.getDataSourceList(this.taskAdapter.sourceDatasourceType, 1);
      this.getDataSourceList(this.taskAdapter.targetDatasourceType, 2);
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
   handleSwitch (row, index) {
     let taskStatus = 1
    if(row.taskStatus == 1) {
      taskStatus = 3;
    }
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定进行此操作么？", onOk: ok});
    function ok () {
      urlList.dataExchange.updateStatus({id: row.id, taskStatus, }).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  handleDel (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定要删除么？", onOk: ok});
    function ok () {
      urlList.dataExchange.deleteExchangeTask({ids: row.id}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  saveDbField () {
    this.fieldMappings = this.$refs.dbField.updateFields();
    this.isDbFieldShow = false
  }
  addInfo () {
    this.infoData.fieldMappings = this.fieldMappings;
    this.infoData.taskAdapter = this.taskAdapter;
    urlList.dataExchange.saveOrUpdateTask({taskContent:JSON.stringify({taskInfo: this.infoData})}).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.search();
      this.isModalShow = false;
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  dbTypeChange1 (val) {
    if(val)
    this.getDataSourceList(val,1)
    this.taskAdapter.sourceDatasourceId = "";
    this.taskAdapter.sourceTableName = "";
  }
  dbTypeChange2 (val) {
    if(val)
    this.getDataSourceList(val,2);
    this.taskAdapter.targetDatasourceId = "";
    this.taskAdapter.targetTableName = "";
  }
  getDbTypeList () {
    urlList.common.dictionaryList({groupCode: 'DATASOURCE_TYPE'}).then(res => { // sueccess 回调
      this.dbTypeList = res.data.dataList;
      this.dbTypeList.forEach(item => {
        item.value = item.code;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getTaskTypeList () {
    urlList.common.dictionaryList({groupCode: 'TASK_TYPE'}).then(res => { // sueccess 回调
      this.taskTypeList = res.data.dataList;
      this.taskTypeList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[2].dataList = this.taskTypeList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getTaskStatusList () {
    urlList.common.dictionaryList({groupCode: 'TASK_STATUS'}).then(res => { // sueccess 回调
      this.taskStatusList = res.data.dataList;
      this.taskStatusList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[3].dataList = this.taskStatusList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getRegionList () {
    urlList.common.regionList().then(res => { // sueccess 回调
      this.regionList = res.data.dataList;
      this.regionList.forEach(item => {
        item.value = item.id;
      });
      this.searchData[1].dataList = this.regionList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  } 
  getTaskNodeList () {
    urlList.dataExchange.taskNodeList().then(res => { // sueccess 回调
      this.taskNodeList = res.data.dataList;
      this.taskNodeList.forEach(item => {
        item.value = item.nodeId;
        item.name = item.nodeName;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getDataSourceList (datasourceType, ioType) {
    urlList.dataExchange.dataSourceList({datasourceType,ioType}).then(res => { // sueccess 回调
      let list = res.data.dataList;
      list.forEach(item => {
        item.value = item.id;
      });
      if (ioType == 1) {
        this.dataSourceList1 = list

      } else {
        this.dataSourceList2 = list

      }
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  
  created () {
    this.search(this.formData);
    this.getTaskNodeList();
    this.getDbTypeList();
    this.getRegionList();
    this.getTaskTypeList();
    this.getTaskStatusList();
  }
  
}
</script>

<style lang="less" scoped>
  @import '../../assets/less/public';
  .list {
    display: flex;
    flex: 1;
    flex-direction: column;    
    .controlBox {
      padding: 0 24px;
    }
    .content {
      .top {
        padding-top: 20px;
        display: flex;
      }
      .middle {
        display: flex;
        padding: 0 60px;
        .item {
          flex: 1;
          width: 0;
        }
        .control {
          width: 150px;
        }
      }
      .bottom {
        display: flex;
        align-items: center;
        .item {
          flex: 1;
          width: 0;
          padding: 0 50px;
          &.left {
            text-align: right;           
          }
        }
        .control {
          width: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .arrow {
            display: flex;
            align-items: center;
            width: 100%;
            &:before {
              content: '';
              display:block;  
              background: @primary-color;
              flex: 1;
              height: 15px;
            }
            &:after {
              content: '';
              display:block;  
              width:0;  
              height:0;  
              border-top: 20px solid transparent;  
              border-left: 30px solid @primary-color;  
              border-bottom: 20px solid transparent;
            }
          }
        }
      }
    }
  }
</style>
