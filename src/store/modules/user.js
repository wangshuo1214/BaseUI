import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response
          if (!data) {
            return reject(response.message)
          }
          const { name, roles, permissions } = data
          const avatar = (data.avatar === '' || data.avatar == null) ? require('@/assets/images/defaultProfile.png') : process.env.VUE_APP_BASE_API + data.avatar
          if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', roles)
            commit('SET_PERMISSIONS', permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出登录
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken() // must remove  token  first
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
