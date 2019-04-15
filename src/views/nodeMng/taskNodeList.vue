<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <!-- 控制按钮 -->
    <div class="controlBox">
      <Button type="info" style="" @click="search"><Icon type="md-refresh" /></Button>
      <div class="info">总数量：{{nodeTaskCount}} 正常：{{nodeTaskNormalCount}}  异常：{{nodeTaskExceptionCount}}</div>
    </div>
    <!-- 列表 -->
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="handleEdit(row, index)" >编辑</Button>
        <Button @click="handleSwitch(row, index)" style="margin-left: 10px;" v-if="row.nodeTaskStatus == 1 || row.nodeTaskStatus == 2" :disable="row.nodeTaskStatus == 2">停用</Button>
        <Button @click="handleSwitch(row, index)" style="margin-left: 10px;" v-if="row.nodeTaskStatus == 3 || row.nodeTaskStatus == 4" :disable="row.nodeTaskStatus == 4">启用</Button>
        <Button @click="handleDel(row, index)" :disabled="row.nodeTaskStatus != 3" style="margin-left: 10px;">删除</Button>
      </template>
      <template slot-scope="{ row, index }" slot="nodeTaskName">
        <Button type="text" class="primary" @click="handleDetail(row, index)">{{row.nodeTaskName}}</Button>
      </template>
    </TableList>
    <!-- 新增弹窗 -->
    <Modal
        v-model="isModalShow"
        title=" "
        @on-ok="addInfo"
        @on-cancel="">
        <Form ref="infoForm" style="width: 400px;" :model="infoData" :rules="rules" label-position="right" :label-width="180">
            <FormItem prop="clientName" label="节点编号：">
                <Input type="text" v-model="infoData.id" disabled>
                </Input>
            </FormItem>
            <FormItem prop="cacheType" label="节点名称：">
              <Input type="text" v-model="infoData.nodeTaskName">
              </Input>
            </FormItem>
            <FormItem prop="url" label="任务上限：">
              <InputNumber v-model="infoData.taskMax" :max="99" :min="1">
              </InputNumber>
            </FormItem>
        </Form>
        <!-- <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
        </div> -->
    </Modal>
    <!-- 详情弹窗 -->
    <Modal
        :width="900"
        v-model="isDetailShow"
        title=" "
        @on-ok=""
        @on-cancel=""
        :transfer="false">
        <div class="detail">
          <div class="infoBox" v-for="item in detailList" :key="item.prop">
            <span class="label">{{item.name}}</span>
            {{detailInfo[item.prop]}}
          </div>
        </div>
        <div slot="footer">
            <Button type="primary"  @click="isDetailShow = false">确认</Button>
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
  },
})
export default class List extends Vue {
  isModalShow = false
  isDetailShow = false
  nodeTaskCount = 0
  nodeTaskNormalCount = 0
  nodeTaskExceptionCount = 0
  searchData = [{
    type: 1,
    value: "",
    prop: "nodeTaskName",
    name: "节点名称"
  },{
    type: 2,
    value: "",
    prop: "nodeServerId",
    name: "物理节点",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "nodeTaskState",
    name: "节点状态",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "nodeTaskStatus",
    name: "服务状态",
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
          title: '节点名称',
          slot: 'nodeTaskName'
      },
      {
          title: '所属物理节点',
          key: 'nodeServerName'
      },
      {
          title: '任务数量',
          key: 'taskCount'
      },
      {
          title: '节点状态',
          key: 'nodeTaskStateName'
      },
      {
          title: '服务状态',
          key: 'nodeTaskStatusName'
      },
      {
          title: '运行时长(h)',
          key: 'runTime'
      },{
          title: '注册时间',
          key: 'registerTime'
      },
      {
        title: '操作',
        slot: 'action',
        width: 250     
      }
  ]
  infoData = {
    id: "",
    nodeTaskName: "",
    taskMax: 0,
  }
  detailInfo = {}
  detailList = [
    {
      value: "",
      prop: "nodeTaskNo",
      name: "节点编码：",
    },{
      value: "",
      prop: "nodeTaskName",
      name: "节点名称：",
    },{
      value: "",
      prop: "nodeServerName",
      name: "所属物理节点：",
    },{
      value: "",
      prop: "registerTime",
      name: "注册时间：",
    },{
      value: "",
      prop: "taskMax",
      name: "任务上限：",
    },{
      value: "",
      prop: "taskCount",
      name: "当前任务数：",
    },{
      value: "",
      prop: "runTimeThis",
      name: "本次运行时长：",
    },{
      value: "",
      prop: "runTime",
      name: "累计运行时长：",
    },{
      value: "",
      prop: "nodeTaskState",
      name: "节点状态：",
    },{
      value: "",
      prop: "nodeTaskStatus",
      name: "服务状态：",
    },{
      value: "",
      prop: "startTime",
      name: "最近启用时间：",
    },{
      value: "",
      prop: "lastTime",
      name: "最近一次心跳时间：",
    },
  ]
  rules = {}
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
    this.getNodeTaskCount();
  }
  getList (data = this.formData) {
    urlList.nodeMng.getNodeTaskList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
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
    this.infoData.id = "";
    this.isModalShow = true;
  }
  handleEdit (row, index) {
    console.log(row, index)
    urlList.nodeMng.getNodeTaskEditVo({id: row.id,}).then(res => { // sueccess 回调
      this.infoData = res.data.taskEditInfo;
      this.infoData.taskMax = Number(this.infoData.taskMax);
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
    this.isModalShow = true;
  }
  handleDetail (row, index) {
    console.log(row, index)
    urlList.nodeMng.getNodeTaskInfo({id: row.id,}).then(res => { // sueccess 回调
      this.detailInfo = res.data.taskInfo;
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
    this.isDetailShow = true;
  }
  handleDel (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定要删除么？", onOk: ok});
    function ok () {
      urlList.nodeMng.delNodeTask({id: row.id,}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  handleSwitch (row, index) {
    let status = 1 ;
    if (row.nodeTaskStatus == 1) {
      status = 3;
    }
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定进行此操作么？", onOk: ok});
    function ok () {
      urlList.nodeMng.setNodeTaskStatus({id: row.id,nodeTaskStatus: status}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  addInfo () {
    urlList.nodeMng.setNodeTask(this.infoData).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.isModalShow = false;
      this.search();
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  getNodeStateList () {
    urlList.common.dictionaryList({groupCode: 'NODE_STATE_TYPE'}).then(res => { // sueccess 回调
      this.nodeStateList = res.data.dataList;
      this.nodeStateList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[2].dataList = this.nodeStateList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getNodeStatusList () {
    urlList.common.dictionaryList({groupCode: 'NODE_STATUS_TYPE'}).then(res => { // sueccess 回调
      this.nodeStatusList = res.data.dataList;
      this.nodeStatusList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[3].dataList = this.nodeStatusList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getNodeServerNameList () {
    urlList.nodeMng.getNodeServerNameList({}).then(res => { // sueccess 回调
      this.nodeServerNameList = res.data.dataList;
      this.nodeServerNameList.forEach(item => {
        item.value = item.id;
        item.name = item.nodeServerName;
      });
      this.searchData[1].dataList = this.nodeServerNameList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getNodeTaskCount () {
    urlList.nodeMng.getNodeTaskCount({}).then(res => { // sueccess 回调  
      this.nodeTaskExceptionCount = res.data.nodeTaskExceptionCount;
      this.nodeTaskNormalCount = res.data.nodeTaskNormalCount;
      this.nodeTaskCount = res.data.nodeTaskCount;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getNodeStateList();
    this.getNodeStatusList();
    this.getNodeServerNameList();
  }
  
}
</script>

<style lang="less" scoped>
  @import '../../assets/less/public';
  .list {
    display: flex;
    flex: 1;
    flex-direction: column;    
    .primary {
      color: @primary-color;
    }
    .controlBox {
      padding: 0 24px;
      .info {
        float: right;
      }
    }
    .detail {
      overflow: hidden;
      height: 300px;
      .infoBox {
        width: 50%;
        padding-left: 150px;
        position: relative;
        float: left;
        font-size: 14px;
        line-height: 50px;
        .label {
          width: 150px;
          position: absolute;
          left:0;
          top:0;
          text-align: right;
          color: #333333;
        }
      }
    }
  }
</style>
