import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { 
        name: 'home' 
      },
    },
    {
      path: '/login',
      name: 'login',
      component: r => require.ensure([], () => r(require('@/views/Login.vue'))),
    },
    {
      path: '/home',
      name: 'home',
      component: r => require.ensure([], () => r(require('@/views/Home.vue'))),
      children: [
        {
        path: '/list',
        name: 'list',
        component: r => require.ensure([], () => r(require('@/views/List.vue'))),
      },
      // {
      //   path: '/resourceList',
      //   name: 'resourceList',
      //   component: r => require.ensure([], () => r(require('@/views/resourceMng/List.vue'))),
      // },
      {
        path: '/dataWarehouseList',
        name: 'dataWarehouseList',
        component: r => require.ensure([], () => r(require('@/views/dataWarehouse/dataWarehouseList.vue'))),
      },{
        path: '/dataOpenList',
        name: 'dataOpenList',
        component: r => require.ensure([], () => r(require('@/views/dataWarehouse/dataOpenList.vue'))),
      },{
        path: '/cacheList',
        name: 'cacheList',
        component: r => require.ensure([], () => r(require('@/views/dataWarehouse/cacheList.vue'))),
      },{
        path: '/clientList',
        name: 'clientList',
        component: r => require.ensure([], () => r(require('@/views/dataWarehouse/clientList.vue'))),
      },{
        path: '/resourceList',
        name: 'resourceList',
        component: r => require.ensure([], () => r(require('@/views/resourceMng/resourceList.vue'))),
      },{
        path: '/nodeList',
        name: 'nodeList',
        component: r => require.ensure([], () => r(require('@/views/nodeMng/nodeList.vue'))),
      },{
        path: '/taskNodeList',
        name: 'taskNodeList',
        component: r => require.ensure([], () => r(require('@/views/nodeMng/taskNodeList.vue'))),
      },{
        path: '/statisticsList',
        name: 'statisticsList',
        component: r => require.ensure([], () => r(require('@/views/logMng/statisticsList.vue'))),
      },{
        path: '/infoList',
        name: 'infoList',
        component: r => require.ensure([], () => r(require('@/views/logMng/infoList.vue'))),
      },{
        path: '/regionList',
        name: 'regionList',
        component: r => require.ensure([], () => r(require('@/views/regionMng/regionList.vue'))),
      },{
        path: '/taskMng',
        name: 'taskMng',
        component: r => require.ensure([], () => r(require('@/views/dataExchange/taskMng.vue'))),
      },
      
      ]
    },    
  ]
})
