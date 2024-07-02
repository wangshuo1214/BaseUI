import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/menu/query',
    method: 'post',
    data
  })
}

export function listMenuExcludeChild(id) {
  return request({
    url: '/menu/exclude',
    method: 'post',
    params: { 'id': id }
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function getMenu(id) {
  return request({
    url: '/menu/get',
    method: 'get',
    params: { id }
  })
}

export function delMenu(id) {
  return request({
    url: '/menu/delete',
    method: 'post',
    params: { 'id': id }
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/menu/roleMenuTreeselect',
    method: 'get',
    params: { 'roleId': roleId }
  })
}
