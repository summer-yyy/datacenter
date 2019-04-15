<template>
  <div class="list">
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="handleEdit(row, index)">操作</Button>
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
    prop: "name",
    name: "数据源名称"
  }, {
    type: 2,
    value: "",
    name: "所属域",
    prop: "region_id",
    dataList: []
  }, {
    type: 2,
    name: "数据源类型",
    value: "",
    prop: "datasource_type",
    dataList: []
  }, {
    type: 2,
    name: "输入输出类型",
    value: "",
    prop: "io_type",
    dataList: []
  }, ]
  columns = [
      {
          title: '仓库名称',
          key: 'storehouseName'
      },
      {
          title: '仓库编码',
          key: 'storehouseCode'
      },
      {
          title: '数据源',
          key: 'datasourceName'
      },
      {
          title: '创建时间',
          key: 'createTime'
      },
      {
        title: '操作',
        slot: 'action'     
      }
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
  getList (data) {
    urlList.storehouseList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
      this.tableData = res.data.dataList;
      this.pageConfig = res.data.pageConfig;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  pageChange () {
    console.log("pageChange")
  }
  pageSizeChange () {
    console.log("pageSizeChange")
  }
  handleEdit (row, index) {
    console.log(row, index)
  }
  
}
</script>

<style lang="less" scoped>
  @import '../assets/less/public';
  .list {
    display: flex;
    flex: 1;
    flex-direction: column;    
  }
</style>
