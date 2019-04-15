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
        <Button @click="handleEdit(row, index)" :disabled="row.status == 1">编辑</Button>
        <Button @click="handleSwitch(row, index)" style="margin-left: 10px;">{{row.status == 1 ? "停用" : "启用"}}</Button>
        <Button @click="handleDel(row, index)" :disabled="row.status == 1"  style="margin-left: 10px;">删除</Button>
      </template>
    </TableList>
    <!-- 新增弹窗 -->
    <Modal
        v-model="isModalShow"
        title=" "
        @on-ok="addInfo"
        @on-cancel="">
        <Form ref="infoForm" style="width: 400px;" :model="infoData" :rules="rules" label-position="right" :label-width="180">
            <FormItem prop="clientName" label="客户端名称：">
                <Input type="text" v-model="infoData.clientName">
                </Input>
            </FormItem>
            <FormItem prop="username" label="账号：">
              <Input type="text" v-model="infoData.username">
              </Input>
            </FormItem>
            <FormItem prop="password" label="密码：">
              <Input type="text" v-model="infoData.password" disabled>
              </Input>
              <Button type="info" @click="createKey">生成</Button>
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
    prop: "clientName",
    name: "客户端名称"
  },{
    type: 2,
    value: "",
    prop: "status",
    name: "状态",
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
          title: '客户端名称',
          key: 'clientName'
      },
      {
          title: '账号（app_id）',
          key: 'username'
      },
      {
          title: '密码（app_securet）',
          key: 'password'
      },
      {
          title: '状态',
          key: 'statusName'
      },
      {
        title: '操作',
        slot: 'action'     
      }
  ]
  infoData = {
    id: "",
    clientName: "",
    username: "",
    password: "",
  }
  cacheTypeList = []
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
    urlList.dataWarehouse.clientInfoList(Object.assign({isPage: 1}, data, this.pageConfig)).then(res => { // sueccess 回调
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
    this.isModalShow = true;
    for(let i in this.infoData) {
      this.infoData[i] = row[i];
    }
  }
  handleDel (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定要删除么？", onOk: ok});
    function ok () {
      urlList.dataWarehouse.deleteClient({id: row.id}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  handleSwitch (row, index) {
    let _this = this;
    this.$Modal.confirm({title: "提示",content: "确定进行此操作么？", onOk: ok});
    function ok () {
      urlList.dataWarehouse.clientOperation({id: row.id, type: row.status == 1 ? 0 : 1 }).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }    
  }
  addInfo () {
    urlList.dataWarehouse.addOrUpdateClientInfo(this.infoData).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.isModalShow = false;
      this.search();
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  //创建客户端秘钥
  createKey() {
    let key = ''
    let numbers = new Array(10).fill(0).map((item, index) => index)
    let Char = []
    for (let i = 65; i < 91; i++) {
      Char.push(String.fromCharCode(i))
    }
    for (let i = 15; i > 0; i--) {
      let type = (Math.random() >= 0.5) ? "Number" : "Char"
      if (type === 'Number') {
        key += numbers[parseInt(Math.random() * 10)]
      } else {
        let middle = Char[parseInt(Math.random() * 26)]
        key += (Math.random() >= 0.5) ? middle.toLowerCase() : middle
      }
    }
    this.infoData.password = key
  }
  getStatusList () {
    urlList.common.dictionaryList({groupCode: 'CLIENT_STATUS'}).then(res => { // sueccess 回调
      this.statusList = res.data.dataList;
      this.statusList.forEach(item => {
        item.value = item.code;
      });
      this.searchData[1].dataList = this.statusList;
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
    }
  }
</style>
