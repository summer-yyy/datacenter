<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <!-- 控制按钮 -->
    <!-- <div class="controlBox">
      <Button type="info" style="width: 90px;" @click="handleAdd">新增</Button>
    </div> -->
    <!-- 列表 -->
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="handleEdit(row, index)" :disabled="row.isOperation == 0">编辑</Button>
        <Button @click="handleDel(row, index)"  :disabled="row.isOperation == 0" style="margin-left: 10px;">删除</Button>
      </template>
      <template slot-scope="{ row, index }" slot="taskName">
        <Button type="text" class="primary" @click="handleDetail(row, index)">{{row.taskName}}</Button>
      </template>
      <div slot="append">
        详细
        <Input v-model="detailInfo.optContent" type="textarea" readonly/>
      </div>
    </TableList>
    <!-- 详情 -->
    <!-- <Modal
        v-model="isDetailShow"
        title=" "
        @on-ok=""
        @on-cancel="">
        <div>{{detailInfo.optContent}}</div>
        <div slot="footer">
        </div>
    </Modal> -->
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
  // isDetailShow = false
  searchData = [{
    type: 1,
    value: "",
    prop: "taskName",
    name: "任务名称"
  },{
    type: 2,
    value: "",
    prop: "optType",
    name: "操作类型",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "status",
    name: "状态",
    dataList: []
  },{
    type: 3,
    value: "",
    prop: "logTime",
    name: "时间",
    dataList: [],
    change: (date) => {
      if(date && date.length>0) {
        this.searchData[4].value = date[0];
        this.searchData[5].value = date[1];
      } else {
        this.searchData[4].value = "";
        this.searchData[5].value = "";
      }    
    }
  },{
    value: "",
    prop: "logTimeS",
  },{
    value: "",
    prop: "logTimeE",
  }]
  columns = [
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '任务名称',
          slot: 'taskName'
      },
      {
          title: '操作类型',
          key: 'optTypeName'
      },
      {
          title: '状态',
          key: 'statusName'
      },
      {
          title: '时间',
          key: 'logTime'
      },
  ]
  tableData = []
  detailInfo = {}
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
    urlList.logMng.loginfoList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
      this.tableData = res.data.dataList;
      this.pageConfig = res.data.pageConfig;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  get formData () {
    let data = {};
    this.searchData.forEach(item => {
      if (item.type != 3)
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
  handleDetail (row, index) {
    console.log(row, index)
    urlList.logMng.taskLogDetail({logId: row.id,}).then(res => { // sueccess 回调
      this.detailInfo = res.data.taskLog;
      // this.isDetailShow = true;
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  getTaskOptList () {
    urlList.common.dictionaryList({groupCode: 'TASK_LOG_OPT_TYPE'}).then(res => { // sueccess 回调
      this.taskOptList = res.data.dataList;
      this.taskOptList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[1].dataList = this.taskOptList
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getTaskStatusList () {
    urlList.common.dictionaryList({groupCode: 'TASK_LOG_STATUS'}).then(res => { // sueccess 回调
      this.taskStatusList = res.data.dataList;
      this.taskStatusList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[2].dataList = this.taskStatusList
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getTaskOptList();
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
    .primary {
      color: @primary-color;
    }
    .controlBox {
      padding: 0 24px;
    }
  }
</style>
