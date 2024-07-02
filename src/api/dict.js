import request from '@/utils/request'

export function queryType(data) {
  return request({
    url: '/dict/type/query',
    method: 'post',
    data
  })
}

export function listType() {
  return request({
    url: '/dict/type/list',
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/dict/data/getDataByType',
    method: 'get',
    params: { dictType }
  })
}

export function getType(id) {
  return request({
    url: '/dict/type/get',
    method: 'get',
    params: { id }
  })
}

export function updateType(data) {
  return request({
    url: '/dict/type/update',
    method: 'post',
    data
  })
}

export function addType(data) {
  return request({
    url: '/dict/type/add',
    method: 'post',
    data
  })
}

export function delType(data) {
  return request({
    url: '/dict/type/delete',
    method: 'post',
    data
  })
}

export function queryData(data) {
  return request({
    url: '/dict/data/query',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/dict/data/update',
    method: 'post',
    data
  })
}

export function addData(data) {
  return request({
    url: '/dict/data/add',
    method: 'post',
    data
  })
}

export function getData(id) {
  return request({
    url: '/dict/data/get',
    method: 'get',
    params: { id }
  })
}

export function delData(data) {
  return request({
    url: '/dict/data/delete',
    method: 'post',
    data
  })
}

// 根据字典类型和字典名称获得唯一的字典
export function getSoleDict(dictType, dictCode) {
  return request({
    url: '/dict/data/sole',
    method: 'get',
    params: { dictType, dictCode }
  })
}
