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
            <FormItem prop="cacheName" label="缓存名称：">
                <Input type="text" v-model="infoData.cacheName">
                </Input>
            </FormItem>
            <FormItem prop="cacheType" label="缓存技术：">
                <Select v-model="infoData.cacheType">
                  <Option v-for="option in cacheTypeList" :value="option.value" :key="option.value">{{ option.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="url" label="地址：">
              <Input type="text" v-model="infoData.url">
              </Input>
            </FormItem>
            <FormItem prop="port" label="端口：">
              <Input type="text" v-model="infoData.port">
              </Input>
            </FormItem>
            <FormItem prop="password" label="密码：">
                <Input type="text" v-model="infoData.password">
                </Input>
                <Checkbox v-model="infoData.usePwd" true-value="1" false-value="0">使用密码</Checkbox>
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
    prop: "cacheName",
    name: "缓存名称"
  },]
  columns = [
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
          title: '缓存名称',
          key: 'cacheName'
      },
      {
          title: '缓存技术',
          key: 'cacheTypeName'
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
    id: "",
    cacheName: "",
    cacheType: "",
    port: "",
    url: "",
    password: "",
    usePwd: 0,
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
    urlList.dataWarehouse.cacheList(Object.assign({isPage: 1}, data, this.pageConfig)).then(res => { // sueccess 回调
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
    this.infoData.usePwd = 0;
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
      urlList.dataWarehouse.deleteCache({id: row.id}).then(res => { // sueccess 回调
        this.$Message.success(res.message);
        _this.search();
      }, res => {// fail 回调
        this.$Message.error(res.message);
      })
    }
  }
  addInfo () {
    urlList.dataWarehouse.addOrUpdateCache(this.infoData).then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.isModalShow = false;
      this.search();
    }, res => {// fail 回调
      this.$Message.error(res.message);
    })
  }
  getCacheTypeList () {
    urlList.common.dictionaryList({groupCode: 'CACHE_TYPE'}).then(res => { // sueccess 回调
      this.cacheTypeList = res.data.dataList;
      this.cacheTypeList.forEach(item => {
        item.value = item.code;
      });
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
  created () {
    this.search(this.formData);
    this.getCacheTypeList();
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
