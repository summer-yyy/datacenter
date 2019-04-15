<template>
  <div class="home">
    <header class="header">数据中心<Icon type="md-power" @click="logout" class="logout"/></header>
    <div class="body">
      <div class="menu">
        <Menu theme="light" :active-name="activeName" :open-names="openNames" accordion>
          <template v-for="menu in menuList">
            <template v-if="menu.children && menu.children.length > 0">
              <Submenu :name="menu.id" :key="menu.id">
                  <template slot="title">
                      <!-- <Icon :type="menu.icon || `ios-paper`" /> -->
                      {{menu.name}}
                  </template>
                  <MenuItem :to="child.path" :name="child.id" v-for="child in menu.children" :key="child.id">{{child.name}}</MenuItem>
              </Submenu>
            </template>
            <MenuItem v-else :to="menu.path" :name="menu.id" :key="menu.id">
            <!-- <Icon style="margin-right: 12px;" :type="menu.icon || `ios-paper`" /> -->
            {{menu.name}}</MenuItem>      
          </template>
        </Menu>
      </div>
      <div class="main">
        <router-view />
      </div>
    </div>    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import urlList from '@/http/apiUrl.js';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  openNames = []
  menuList = [
    // {
    //   id: "1",
    //   name: '主页',
    //   path: '/home'
    // },
    {
      id: "2",
      name: '节点管理',
      children: [
        {
          id: "2-1",
          name: '物理节点',
          path: '/nodeList'
        },
        {
          id: "2-2",
          name: '任务节点',
          path: '/taskNodeList'
        },
      ] 
    },
    {
      id: "3",
      name: '资源管理',
      children: [
        {
          id: "3-1",
          name: '数据源管理',
          path: '/resourceList'
        },
      ] 
    },
    {
      id: "4",
      name: '数据交换',
      children: [
        {
          id: "4-1",
          name: '任务管理',
          path: '/taskMng'
        },
      ] 
    },
    {
      id: "5",
      name: '数据仓库',
      children: [
        {
          id: "5-1",
          name: '仓库管理',
          path: '/dataWarehouseList'
        },
        {
          id: "5-2",
          name: '数据开放',
          path: '/dataOpenList'   
        },{
          id: "5-3",
          name: '客户端管理',
          path: '/clientList'
        },{
          id: "5-4",
          name: '缓存管理',
          path: '/cacheList'
        },
      ] 
    },
    {
      id: "6",
      name: '日志管理',
      children: [
        {
          id: "6-1",
          name: '统计',
          path: '/statisticsList'
        },
        {
          id: "6-2",
          name: '记录',
          path: '/infoList'
        },
      ] 
    },
    {
      id: "7",
      name: '域管理',
      children: [
        {
          id: "7-1",
          name: '域管理',
          path: '/regionList'
        },
      ] 
    },
  ]
  findPath (list,path) {
    for(let i in list) {
      if (list[i].path == path) {
        return list[i];
      } else if(list[i].children && list[i].children.length > 0) {
        let res = this.findPath(list[i].children,path);
        if(res) return res;
      }
    }
  }
  get activeName () {
    let path = this.$route.path;
    let item = this.findPath(this.menuList,path);
    if (!item) {
      this.$router.push("nodeList");
      return;
    }
    this.openNames = [item.id.split("-")[0]];
    return item.id;
  }
  logout () {
    urlList.common.logout().then(res => { // sueccess 回调
      this.$Message.success(res.message);
      this.$router.replace("login");
    }, res => {// fail 回调
      console.log("reject",res)
    })
  }
}
</script>
<style lang="less">
.home {
  .ivu-menu-vertical.ivu-menu-light:after {
    background: #fff !important;
  }
}
</style>

<style lang="less" scoped>
  @import '../assets/less/public';
  .home {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f4f4f4;
    .header {
      background: @primary-color;
      height: 60px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      color: #fff;
      .logout {
        cursor: pointer;
      }
    }
    .body {
      display: flex;
      flex: 1;
      .menu {
        background: #fff;
        width: 240px;
      }
      .main {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }
  }
</style>
