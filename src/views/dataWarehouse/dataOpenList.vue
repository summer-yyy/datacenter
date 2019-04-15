<template>
  <div class="list">
    <!-- 搜索 -->
    <Search :searchData.sync="searchData" @search="search">
    </Search>
    <!-- 控制按钮 -->
    <div class="controlBox">
      <Button type="info" style="width: 90px;" @click="handleAdd">新增</Button>
    </div>
    <!-- 列表 -->
    <TableList :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange">
      <template slot-scope="{ row, index }" slot="action">
        <Button @click="handleEdit(row, index)">编辑</Button>
        <Button @click="handleDel(row, index)" style="margin-left: 10px;">删除</Button>
      </template>
    </TableList>
    <!-- 新增弹窗 -->
    <Modal
        v-model="isModalShow"
        title=" "
        @on-ok="addInfo"
        @on-cancel="">
        <Form ref="infoForm" style="width: 400px;" :model="infoData" :rules="rules" label-position="right" :label-width="180">
            <FormItem prop="storehouseId" label="仓库：">
                <Select v-model="infoData.storehouseId">
                  <Option v-for="option in storehouseList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="clientId" label="客户端：">
                <Select v-model="infoData.clientId">
                  <Option v-for="option in clientList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="authorizationType" label="授权形式：">
                <Select v-model="infoData.authorizationType">
                  <Option v-for="option in authorizationTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="startTime" label="开始时间：">
              <DatePicker v-model="infoData.startTime" type="datetime" placeholder="" style="width: 100%;" @on-change="timeChange1"></DatePicker>
            </FormItem>
            <FormItem prop="endTime" label="结束时间：">
              <DatePicker v-model="infoData.endTime" type="datetime" placeholder="" style="width: 100%" @on-change="timeChange2"></DatePicker>
            </FormItem>
            <FormItem prop="cacheId" label="缓存：">
                <Select v-model="infoData.cacheId">
                  <Option v-for="option in cacheList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
                <Checkbox v-model="infoData.useCache" true-value="1" false-value="0">使用缓存</Checkbox>
            </FormItem>
            <FormItem prop="cacheTime" label="缓存失效时间：">
                <Input type="text" v-model="infoData.cacheTime">
                  <span slot="append">分</span>
                </Input>
            </FormItem>
        </Form>
        <!-- <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>
        </div> -->
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
  searchData = [{
    type: 1,
    value: "",
    prop: "storehouseName",
    name: "仓库名称"
  },{
    type: 1,
    value: "",
    prop: "clientName",
    name: "客户端名称"
  },{
    type: 3,
    value: "",
    prop: "time",
    name: "时间",
    change: (date) => {
      if(date && date.length>0) {
        this.searchData[3].value = date[0];
        this.searchData[4].value = date[1];
      } else {
        this.searchData[3].value = "";
        this.searchData[4].value = "";
      }    
    }
  },{
    value: "",
    prop: "startTime",
  },{
    value: "",
    prop: "endTime",
  }]
  columns = [
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '仓库名称',
          key: 'storehouseName'
      },
      {
          title: '客户端',
          key: 'clientName'
      },
      {
          title: '授权形式',
          key: 'authorizationTypeName'
      },
      {
          title: '开始时间',
          key: 'startTime'
      },
      {
          title: '结束时间',
          key: 'endTime'
      },
      {
        title: '操作',
        slot: 'action'     
      }
  ]
  infoData = {
    id: "",
    storehouseId: "",
    clientId: "",
    authorizationType: "",
    startTime: "",
    endTime: "",
    cacheId: "",
    cacheTime: "",
    useCache: "",
  }
  datasourceList = []
  storehouseList = []
  cacheList = []
  clientList = []
  authorizationTypeList = []
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
  }
  getList (data = this.formData) {
    urlList.dataWarehouse.dataOpenList(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
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
  timeChange1 (val) {
    console.log(val)
    this.infoData.startTime = val;
  }
  timeChange2 (val) {
    this.infoData.endTime = val;
  }
  handleAdd () {
    this.$refs.infoForm.resetFields();
    this.infoData.id = "";
    this.infoData.useCache = 0;
    this.isModalShow = true;
  }
  handleEdit (row, index) {
    console.log(row, index)
    this.isModalShow = true;
    for(let i in this.infoData) {
      this.infoData[i] = row[i]+"";
    }
  }
  handleDel (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定要删除么？", onOk: ok});
    function ok () {
      urlList.dataWarehouse.deleteDataOpen({id: row.id}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  addInfo () {
    if (this.infoData.startTime instanceof Date) {
      this.infoData.startTime = this.infoData.startTime.format("yyyy-MM-dd hh:mm:ss")
    }
    if (this.infoData.endTime instanceof Date) {
      this.infoData.endTime = this.infoData.endTime.format("yyyy-MM-dd hh:mm:ss")
    }
    urlList.dataWarehouse.addOrUpdateDataOpen(this.infoData).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.isModalShow = false;
      this.search();
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  getStorehouseList () {
    urlList.dataWarehouse.storehouseList({isPage: 0}).then(res => { // sueccess 回调
      this.storehouseList = res.data.dataList;
      this.storehouseList.forEach(item => {
        item.value = item.id;
        item.name = item.storehouseName;
      }); 
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getCacheList () {
    urlList.dataWarehouse.cacheList({isPage: 0}).then(res => { // sueccess 回调
      this.cacheList = res.data.dataList;
      this.cacheList.forEach(item => {
        item.value = item.id;
        item.name = item.cacheName;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getClientInfoList () {
    urlList.dataWarehouse.clientInfoList({isPage: 0}).then(res => { // sueccess 回调
      this.clientList = res.data.dataList;
      this.clientList.forEach(item => {
        item.value = item.id;
        item.name = item.clientName;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getAuthorizationTypeList () {
    urlList.common.dictionaryList({groupCode: 'AUTHORIZATION_TYPE'}).then(res => { // sueccess 回调
      this.authorizationTypeList = res.data.dataList;
      this.authorizationTypeList.forEach(item => {
        item.value = item.code;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getStorehouseList();
    this.getCacheList();
    this.getClientInfoList();
    this.getAuthorizationTypeList();
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
