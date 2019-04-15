<template>
  <div class="search">
    <Form ref="formInline" :model="formData" inline @submit.native.prevent @keydown.enter.native="search" :label-position="labelPosition" :label-width="labelWidth">
      <FormItem :label="item.name + `：`" v-for="item, index in searchData" :key="index" v-if="item.type">
        <!-- type : 1 input,2 select, 3 timepicker -->
          <Input type="text" v-model="formData[item.prop]" placeholder="" v-if="item.type == 1">
          </Input>
          <Select v-model="formData[item.prop]"  v-if="item.type == 2" style="width: 160px;" placeholder="全部" clearable>
            <Option v-for="option in item.dataList" :value="option.value" :key="option.value">{{ option.name }}</Option>
          </Select>
          <DatePicker v-model="formData[item.prop]" type="daterange" placement="bottom-end" placeholder="" v-if="item.type == 3" @on-change="item.change" style="width: 200px"></DatePicker>
      </FormItem>
      <Button type="primary" @click="search" :style="{width:'120px', 'margin-top': labelPosition != 'top' ? '':'22px'}">搜索</Button>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit} from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Search extends Vue {
  @Prop({
    type: Array, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
    default: () => {
        return []
    }
  })
  searchData: any[];

  @Prop({
    type: String, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
    default: "top"
  })
  labelPosition: string;

  @Prop({
    type: Number, 
    // 如果是对象或数组的话。默认值从一个工厂函数中返回
  })
  labelWidth: number;

  @Emit()
    search () {
      let data = Object.assign({},this.formData);
      let timeArr = this.searchData.filter(item => {
        return item.type == 3;
      });
      console.log(timeArr)
      timeArr.forEach(item => {
        data[item.prop] = undefined;
      })
      this.searchData.forEach(item => {
        item.value = data[item.prop]
      })
      return data;
  }

  get formData () {
    let data = {};
    this.searchData.forEach(item => {
      data[item.prop] = item.value;
    });
    return data;
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/less/public';
  .search {
    margin: 24px; 
    margin-bottom: 12px; 
    padding: 24px;
    padding-bottom: 0px;
    border-radius: 10px; 
    background: #fff;
  }
</style>
