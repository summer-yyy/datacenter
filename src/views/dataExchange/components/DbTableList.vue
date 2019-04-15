<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" :labelWidth="80" label-position="right" @search="search" style="margin: 0;">
    </Search>
    <!-- 控制按钮 -->
    <!-- <div class="controlBox">
      <Button type="info" style="width: 90px;" @click="handleAdd">新增</Button>
    </div> -->
    <!-- 列表 -->
    <TableList style="margin: 0;" :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange" @selection-change="selectionChange">
      <template slot-scope="{ row, index }" slot="radio">
        <Radio :label="row.objectName +','+ row.catalogSchema"><span></span></Radio>  
      </template>
    </TableList>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
    Search: r => require.ensure([], () => r(require('@/components/Search/Search.vue'))),
    TableList: r => require.ensure([], () => r(require('@/components/TableList/TableList.vue'))),
  },
})
export default class List extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  datasourceType: string
  @Prop({
    type: String,
    default: ''
  })
  datasourceId: string
  searchData = [{
    type: 2,
    value: "",
    prop: "catalogSchema",
    name: "数据库",
    dataList: []
  },{
    type: 1,
    value: "",
    prop: "tableName",
    name: "表名",
  }]
  columns = [
      {
        title: ' ',
        slot: 'radio',
        width: 60,
      },
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '表名',
          key: 'objectName'
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
    urlList.dataExchange.dbTableList(Object.assign({datasourceId: this.datasourceId,datasourceType: this.datasourceType}, data, this.pageConfig)).then(res => { // sueccess 回调
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
  selectionChange (list) {
    this.$emit("on-change", list)
  }
  getDatabaseList (datasourceType, datasourceId) {
    urlList.dataExchange.databaseList({datasourceId,datasourceType}).then(res => { // sueccess 回调
      this.searchData[0].dataList = res.data.dataList;
      this.searchData[0].dataList.forEach(item => {
        item.value = item.catalogSchema;
        item.name = item.catalogSchemaName;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getDatabaseList(this.datasourceType, this.datasourceId)
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
