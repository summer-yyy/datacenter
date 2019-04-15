<template>
  <div class="tableList">
    <RadioGroup v-model="checkVal" @on-change="selectionChange">
      <Table style="flex:1;" :columns="columns" :data="data" @on-selection-change="selectionChange">
        <template slot-scope="{ row, index }" v-for="column in columns" :slot="column.slot" v-if="column.slot">
          <slot :name="column.slot" :row="row" :index="index"></slot>
        </template>
      </Table>
    </RadioGroup>
    <Page v-if="hasPage" :current="pageNum" style="height: 50px; text-align: center; line-height: 50px;" :total="totalCount" show-elevator show-sizer @on-page-size-change="pageSizeChange" @on-change="pageChange" />
    <slot name="append"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit} from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class TableList extends Vue {
  @Prop({
    type: Array, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
    default: () => {
        return []
    }
  })
  data: any[];

  @Prop({
    type: Array, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
    default: () => {
        return []
    }
  })
  columns: any[];

  @Prop({
    type: Boolean, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
    default: true
  })
  hasPage: boolean;

  @Prop()
  pageNum: number;

  @Prop()
  totalCount: number;

  @Prop()
  pageSize: number;
  checkVal = ""

  @Emit()
    pageChange (pageNum) {
    console.log(pageNum)

      return pageNum;
  }
  @Emit()
    pageSizeChange (pageSize) {
      console.log(pageSize)
      return pageSize;
  }
  @Emit()
    selectionChange (list) {
      console.log(list)
      return list;
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/less/public';
  .tableList {
    height: 100%;
    margin: 24px; 
    margin-top: 12px; 
    padding: 24px;
    padding-bottom: 0px;
    border-radius: 10px; 
    background: #fff;
    display: flex;
    flex-direction: column;
  }
</style>
