import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: '/role/query',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function getRole(id) {
  return request({
    url: '/role/get',
    method: 'get',
    params: { id }
  })
}

export function delRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

export function authUserSelect(data) {
  return request({
    url: '/role/allocate',
    method: 'post',
    data
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/role/unAllocate',
    method: 'post',
    data
  })
}
