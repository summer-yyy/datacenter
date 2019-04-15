/**
* api接口统一管理
*/
import { get, post } from './http'
// const context = "/dec";
const context = "/bdc-mgt";

const urlList = {
  common: {
    login: p => post(context + '/sys/user/login.do', p),// 登录
    logout: p => post(context + '/sys/user/logout.do', p),// 注销    
    dictionaryList: p => post(context + '/common/dictionaryList.do', p),// 获取字典项列表
    regionList: p => post(context + '/common/region/list.do', p),// 获取交换域列表
  },
  dataWarehouse: {
    addOrUpdateStorehouse: p => post(context + '/data/addOrUpdateStorehouse.do', p),// 新增或者编辑数据仓库
    storehouseList: p => post(context + '/data/storehouseList.do', p),// 新增或者编辑数据仓库
    deleteStorehouse: p => post(context + '/data/deleteStorehouse.do', p),// 删除数据仓库
    addOrUpdateDataOpen: p => post(context + '/data/addOrUpdateDataOpen.do', p),// 新增或者编辑数据开放
    dataOpenList: p => post(context + '/data/dataOpenList.do', p),// 数据开放列表
    deleteDataOpen: p => post(context + '/data/deleteDataOpen.do', p),// 删除数据开放
    addOrUpdateClientInfo: p => post(context + '/data/addOrUpdateClientInfo.do', p),// 新增或者编辑客户端
    clientInfoList: p => post(context + '/data/clientInfoList.do', p),// 客户端列表
    deleteClientInfo: p => post(context + '/data/deleteClientInfo.do', p),// 删除客户端
    addOrUpdateCache: p => post(context + '/data/addOrUpdateCache.do', p),// 新增或者编辑缓存
    cacheList: p => post(context + '/data/cacheList.do', p),// 缓存列表
    deleteCache: p => post(context + '/data/deleteCache.do', p),// 删除缓存
    datasourceList: p => post(context + '/data/datasourceList.do', p),// 数据源下拉列表
    clientOperation: p => post(context + '/data/clientOperation.do', p),// 客户端停用或者启用接口
  },  
  resourceMng: {
    list: p => post(context + '/resource/list.do', p),// 数据源管理-列表
    del: p => post(context + '/resource/del.do', p),// 数据源管理-删除
    save: p => post(context + '/resource/save.do', p),// 数据源管理-保存
    edit: p => post(context + '/resource/edit.do', p),// 数据源管理-编辑
    test: p => post(context + '/resource/test.do', p),// 数据源管理-测试连接
  },
  nodeMng: {
    getNodeServerList: p => post(context + '/node/server/getNodeServerList.do', p),// 获取物理节点信息列表
    getNodeServerNameList: p => post(context + '/node/server/getNodeServerNameList.do', p),// 获取物理节点下拉框列表
    getNodeTaskList: p => post(context + '/node/task/getNodeTaskList.do', p),// 获取任务节点信息列表
    getNodeTaskInfo: p => post(context + '/node/task/getNodeTaskInfo.do', p),// 获取任务节点详细信息
    getNodeTaskEditVo: p => post(context + '/node/task/getNodeTaskEditVo.do', p),// 获取待编辑的任务节点信息
    setNodeTask: p => post(context + '/node/task/setNodeTask.do', p),// 编辑任务节点信息
    setNodeTaskStatus: p => post(context + '/node/task/setNodeTaskStatus.do', p),// 设置任务节点状态
    delNodeTask: p => post(context + '/node/task/delNodeTask.do', p),// 逻辑删除任务节点
    getNodeTaskCount: p => post(context + '/node/task/getNodeTaskCount.do', p),// 任务节点数量统计
    getNodeServerCount: p => post(context + '/node/server/getNodeServerCount.do', p),// 物理节点数量统计

  },
  logMng: {
    statisticsLogList: p => post(context + '/log/statisticsLogList.do', p),// 日志统计
    loginfoList: p => post(context + '/log/loginfoList.do', p),// 日志记录
    taskLogDetail: p => post(context + '/log/taskLogDetail.do', p),// 查看日志详细信息
  },
  regionMng: {
    list: p => post(context + '/region/list.do', p),// 获取交换域列表（带分页）
    saveOrUpdateRegion: p => post(context + '/region/saveOrUpdateRegion.do', p),// 新增或编辑交换域信息
    deleteRegion: p => post(context + '/region/deleteRegion.do', p),// 批量）删除指定交换域\
    updateStatus: p => post(context + '/region/updateStatus.do', p),// 启用或禁用指定交换域\
    detail: p => post(context + '/region/detail.do', p),// 获取指定交换域信息（查询|编辑反显）
  },
  dataExchange: {
    taskNodeList: p => post(context + '/exchangetask/taskNodeList.do', p),// 获取任务节点列表
    dataSourceList: p => post(context + '/exchangetask/dataSourceList.do', p),// 获取指定数据源类型下的数据源列表
    list: p => post(context + '/exchangetask/list.do', p),// 获取交换任务列表（带分页）
    detail: p => post(context + '/exchangetask/detail.do', p),// 获取指定交换任务信息（查询|编辑反显）
    saveOrUpdateTask: p => post(context + '/exchangetask/saveOrUpdateTask.do', p),// 新增或编辑交换任务信息
    deleteExchangeTask: p => post(context + '/exchangetask/deleteExchangeTask.do', p),// 删除指定交换任务
    updateStatus: p => post(context + '/exchangetask/updateStatus.do', p),// 启用或禁用指定交换任务
    databaseList: p => post(context + '/exchangetask/databaseList.do', p),// 获取指定数据库列表
    dbTableList: p => post(context + '/exchangetask/dbTableList.do', p),// 获取指定数据库表列表（带分页）
    dbTableFieldList: p => post(context + '/exchangetask/dbTableFieldList.do', p),// 获取指定数据库表字段列表
  },
}

export default urlList;