import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function listUser(data) {
  return request({
    url: '/user/query',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function getUser(id) {
  return request({
    url: '/user/get',
    method: 'get',
    params: { id }
  })
}

export function delUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function resetPwd(id) {
  return request({
    url: '/user/reset',
    method: 'post',
    params: { 'id': id }
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  return request({
    url: '/user/changeStatus',
    method: 'post',
    params: { 'id': id, 'status': status }
  })
}

export function allocatedUserList(data) {
  return request({
    url: '/user/allocated',
    method: 'post',
    data
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(data) {
  return request({
    url: '/user/unAllocated',
    method: 'post',
    data
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}

export function getUserProfile() {
  return request({
    url: '/user/getProfile',
    method: 'get'
  })
}

// 查询角色未授权用户列表
export function updateUserProfile(data) {
  return request({
    url: '/user/updateProfile',
    method: 'post',
    data
  })
}

export function updatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    data
  })
}
