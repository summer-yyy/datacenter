<template>
  <div class="list">
    <!-- 控制按钮 -->
    <div class="controlBox">
      <Button type="info" @click="handleAdd"><Icon type="md-add" /></Button>
      <Button type="error" style="margin-left: 10px;" @click="handleDel"><Icon type="md-remove" /></Button>
    </div>
    <!-- 列表 -->
    <TableList :hasPage="false" style="margin: 0;" :data="tableData" :pageNum="pageConfig.page" :totalCount="pageConfig.totalCount" :columns="columns" @page-change="pageChange" @page-size-change="pageSizeChange" @selection-change="selectionChange">
      <template slot-scope="{ row, index }" slot="match">
        <Input type="text" v-model="row.match" @on-blur="save(row.match, index, 'match')">
        </Input>
      </template>
      <template slot-scope="{ row, index }" slot="transfer">
        <Input type="text" v-model="row.transfer" @on-blur="save(row.transfer, index, 'transfer')">
        </Input>
      </template>
    </TableList>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit} from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
    Search: r => require.ensure([], () => r(require('@/components/Search/Search.vue'))),
    TableList: r => require.ensure([], () => r(require('@/components/TableList/TableList.vue'))),
  },
  watch: {
    value (val) {
      console.log(val)
      if (val) {
        this.tableData = [];
        let arr = val.split(",");
        arr.forEach(item => {
          this.tableData.push({
            id: this.count++,
            match: item.split("=")[0],
            transfer: item.split("=")[1],
          })
        })
      } else {
        this.tableData = [];
      }
    }
  }
})
export default class List extends Vue {
  @Prop({
    type: String,
    default: "",
  })
  value: string
  selectlist = []
  count = 0
  columns = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        type: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
        title: '匹配',
        slot: 'match'
      },
      {
        title: '转换',
        slot: 'transfer'
      },
  ]
  tableData = []
  pageConfig = {
      "page": 1,
      "totalPage": 1,
      "totalCount": 100,
      "pageSize": 10
  }
  handleAdd () {
    this.tableData.push({
      id: this.count++,
      match: "",
      transfer: "",
    })
  }
  handleDel () {
    if (this.selectlist.length == 0) return;
    let ids = this.selectlist.map(item => item.id);
    this.tableData.forEach((item, index) => {
      if (ids.includes(item.id)) {
        this.tableData.splice(index, 1);
      }
    })
    console.log(this.tableData)
    this.selectlist = [];
  }
  save (val, index, key) {
    this.tableData[index][key] = val;
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
    this.selectlist = list;
  }

  // @Emit("input")
  updateRules () {
    let rules = []
    this.tableData.forEach(item => {
      if(item.match != "" && item.transfer != "") {
        rules.push(item.match  + "=" + item.transfer);
      }
    })
    this.$emit("input", rules.join(","));
    console.log(rules)
    // return rules.join(",");
  }
  created () {  
    if (this.value) {
      this.tableData = [];
      let arr = this.value.split(",");
      arr.forEach(item => {
        this.tableData.push({
          id: this.count++,
          match: item.split("=")[0],
          transfer: item.split("=")[1],
        })
      })
    } else {
      this.tableData = [];
    }
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
