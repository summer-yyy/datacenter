<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <!-- 控制按钮 -->
    <div class="controlBox">
      <Button type="info" style="" @click="search"><Icon type="md-refresh" /></Button>
      <div class="info">总数量：{{nodeServerCount}} 正常：{{nodeServerNormalCount}}  异常：{{nodeServerExceptionCount}}</div>
    </div>
    <!-- 列表 -->
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="nodeServerMem">
        <Progress :percent="Number(row.nodeServerMem.substring(0, row.nodeServerMem.length-1))" :stroke-color="Number(row.nodeServerMem.substring(0, row.nodeServerMem.length-1))>80?'#ed4014':Number(row.nodeServerMem.substring(0, row.nodeServerMem.length-1))>50?'#ff9900':'#19be6b'" hide-info>
        </Progress>
        {{row.nodeServerMem}}
      </template>

      <template slot-scope="{ row, index }" slot="nodeServerCpu">
        <Progress :percent="Number(row.nodeServerCpu.substring(0, row.nodeServerCpu.length-1))" :stroke-color="Number(row.nodeServerCpu.substring(0, row.nodeServerMem.length-1))>80?'#ed4014':Number(row.nodeServerCpu.substring(0, row.nodeServerCpu.length-1))>50?'#ff9900':'#19be6b'" hide-info>
        </Progress>
        {{row.nodeServerCpu}}
      </template>
    </TableList>
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
  nodeServerExceptionCount = 0
  nodeServerCount = 0
  nodeServerNormalCount = 0
  isModalShow = false
  searchData = [{
    type: 1,
    value: "",
    prop: "nodeServerName",
    name: "节点名称"
  },{
    type: 2,
    value: "",
    prop: "nodeServerState",
    name: "状态",
    dataList: []
  }]
  columns = [
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '计算机名称',
          key: 'nodeServerName'
      },
      {
          title: '操作系统',
          key: 'nodeServerOs'
      },
      {
          title: '内网IP',
          key: 'nodeServerIp'
      },
      {
          title: '状态',
          key: 'nodeServerState'
      },{
          title: 'CPU',
          slot: 'nodeServerCpu'
      },
      {
          title: 'MEM',
          slot: 'nodeServerMem'
      },
  ]
  tableData = []
  pageConfig = {
      "page": 1,
      "totalPage": 1,
      "totalCount": 100,
      "pageSize": 10
  }
  search (data) {
    this.pageConfig.page = 1;
    this.getNodeServerCount();
    this.getList(data);
  }
  getList (data = this.formData) {
    urlList.nodeMng.getNodeServerList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调    
      if (res.status == 1) {
        this.tableData = res.data.dataList;
        this.pageConfig = res.data.pageConfig; 
      } else {
        this.$Message.error(res.message);
      }
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
  getStatusList () {
    urlList.common.dictionaryList({groupCode: 'NODE_STATE_TYPE'}).then(res => { // sueccess 回调
      this.statusList = res.data.dataList;
      this.statusList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[1].dataList = this.statusList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getNodeServerCount () {
    urlList.nodeMng.getNodeServerCount().then(res => { // sueccess 回调   
      this.nodeServerNormalCount = res.data.nodeServerNormalCount;
      this.nodeServerExceptionCount = res.data.nodeServerExceptionCount;
      this.nodeServerCount = res.data.nodeServerCount;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getStatusList();
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
      .info {
        float: right;
      }
    }
  }
</style>
