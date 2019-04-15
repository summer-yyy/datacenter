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
        <Button @click="handleEdit(row, index)" :disabled="row.isOperation == 0">编辑</Button>
        <Button @click="handleDel(row, index)"  :disabled="row.isOperation == 0" style="margin-left: 10px;">删除</Button>
      </template>
    </TableList>
    <!-- 新增弹窗 -->
    <Modal
        v-model="isModalShow"
        title=" "
        @on-ok="addInfo"
        @on-cancel="">
        <Form ref="infoForm" style="width: 400px;" :model="infoData" :rules="rules" label-position="right" :label-width="180">
            <FormItem prop="cacheName" label="数据源类型：">
              <RadioGroup v-model="infoData.datasourceType">
                  <Radio v-for="option in datasourceTypeList" :label="option.value" :key="option.value">{{ option.name }}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="cacheType" label="输入输出类型：">
                <Select v-model="infoData.ioType">
                  <Option v-for="option in ioTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="url" label="所属域：">
              <Select v-model="infoData.regionId">
                <Option v-for="option in regionList" :value="option.value" :key="option.value">{{ option.name }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="port" label="名称：">
              <Input type="text" v-model="infoData.name">
              </Input>
            </FormItem>
            <FormItem prop="password" label="数据库类型：">
                <Select v-model="infoData.type">
                  <Option v-for="option in dbTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="port" label="库名：">
              <Input type="text" v-model="infoData.dbName">
              </Input>
            </FormItem><FormItem prop="port" label="主机IP：">
              <Input type="text" v-model="infoData.host">
              </Input>
            </FormItem><FormItem prop="port" label="端口：">
              <Input type="text" v-model="infoData.port">
              </Input>
            </FormItem><FormItem prop="port" label="用户名：">
              <Input type="text" v-model="infoData.username">
              </Input>
            </FormItem><FormItem prop="port" label="密码：">
              <Input type="text" v-model="infoData.password">
              </Input>
            </FormItem>
            <FormItem prop="password" label="附加连接字符串：">
                <Input type="textarea" v-model="infoData.connectStr">
                </Input>
                <Checkbox v-model="infoData.usePool" :true-value="1" :false-value="0">使用连接池</Checkbox>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="isModalShow=false">取消</Button>
            <Button style="margin-left: 20px;" type="primary" @click="addInfo">保存</Button>
            <Button style="margin-left: 20px;" type="info" @click="testContext">测试连接</Button>
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
  searchData = [{
    type: 1,
    value: "",
    prop: "name",
    name: "数据源名称"
  },{
    type: 2,
    value: "",
    prop: "regionId",
    name: "所属域",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "datasourceType",
    name: "数据源类型",
    dataList: []
  },{
    type: 2,
    value: "",
    prop: "ioType",
    name: "输入输出类型",
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
          title: '数据源名称',
          key: 'name'
      },
      {
          title: '所属域',
          key: 'regionName'
      },
      {
          title: '数据源类型',
          key: 'datasourceTypeName'
      },
      {
          title: '输入输出类型',
          key: 'ioTypeName'
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
  infoData = {
    datasourceId: "",
    "name": "", //数据源名称
    "regionId": "", //所属域id
    "ioType": "",//输入输出类型,1-输入/输出， 2-输入， 3-输出
    "datasourceType": "",//数据源类型,1-DB，2-API
    "type": "",//数据库类型,1-MySQL，2-Oracle
    "dbName": "",//库名
    "host": "",//主机IP
    "port": "",//端口
    "username": "",//用户名
    "password": "",//密码
    "connectStr": "",//附加连接字符串
    "usePool": "" //使用连接池,0-不使用，1-使用
  }
  datasourceTypeList = []
  ioTypeList = []
  dbTypeList = []
  regionList = []
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
    urlList.resourceMng.list(Object.assign({}, data, this.pageConfig)).then(res => { // sueccess 回调
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
    this.infoData.datasourceId = "";
    this.isModalShow = true;
  }
  handleEdit (row, index) {
    console.log(row, index)
    this.isModalShow = true;
    urlList.resourceMng.edit({id: row.id}).then(res => { // sueccess 回调
      this.infoData = res.data;
      for (let i in this.infoData) {
        this.infoData[i] = this.infoData[i] + "";
      }
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  handleDel (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定要删除么？", onOk: ok});
    function ok () {
      urlList.resourceMng.del({id: row.id}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  addInfo () {
    urlList.resourceMng.save({id: this.infoData.datasourceId, data: JSON.stringify(this.infoData)}).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.isModalShow = false;
      this.search();
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  testContext () {
    urlList.resourceMng.test({id: this.infoData.datasourceId, data: JSON.stringify(this.infoData)}).then(res => { // sueccess 回调
      this.$Message.success(res.message);
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  getDatasourceTypeList () {
    urlList.common.dictionaryList({groupCode: 'DATASOURCE_TYPE'}).then(res => { // sueccess 回调
      this.datasourceTypeList = res.data.dataList;
      this.datasourceTypeList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[2].dataList = this.datasourceTypeList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getDbTypeList () {
    urlList.common.dictionaryList({groupCode: 'DATABASE_TYPE'}).then(res => { // sueccess 回调
      this.dbTypeList = res.data.dataList;
      this.dbTypeList.forEach(item => {
        item.value = item.code;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getIoTypeList () {
    urlList.common.dictionaryList({groupCode: 'IO_TYPE'}).then(res => { // sueccess 回调
      this.ioTypeList = res.data.dataList;
      this.ioTypeList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[3].dataList = this.ioTypeList;
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  getRegionlist () {
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
  created () {
    this.search(this.formData);
    this.getDatasourceTypeList();
    this.getDbTypeList();
    this.getRegionlist();
    this.getIoTypeList();
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
