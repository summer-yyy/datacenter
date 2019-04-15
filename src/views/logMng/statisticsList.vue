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
  searchData = [{
    type: 1,
    value: "",
    prop: "taskName",
    name: "任务名称"
  },{
    type: 2,
    value: "",
    prop: "taskType",
    name: "任务类型",
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
          title: '任务名称',
          key: 'taskName'
      },
      {
          title: '任务类型',
          key: 'taskTypeName'
      },
      {
          title: '来源',
          key: 'inputSourceName'
      },
      {
          title: '目标',
          key: 'outputSourceName'
      },
      {
          title: '总数',
          key: 'totalNum'
      },
      {
          title: '成功',
          key: 'succNum'
      },
      {
          title: '失败',
          key: 'failNum'
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
    this.getList(data);
  }
  getList (data = this.formData) {
    urlList.logMng.statisticsLogList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
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
  getTaskTypeList () {
    urlList.common.dictionaryList({groupCode: 'TASK_TYPE'}).then(res => { // sueccess 回调
      this.taskTypeList = res.data.dataList;
      this.taskTypeList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[1].dataList = this.taskTypeList
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getTaskTypeList();
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
  }
</style>
