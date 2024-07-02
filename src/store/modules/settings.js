import defaultSettings from '@/settings'
import variables from '@/assets/styles/element-variables.scss'

const { sideTheme, showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const state = {
  title: '',
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  theme: storageSetting.theme || variables.theme,
  sideTheme: storageSetting.sideTheme || sideTheme,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 设置网页标题
  setTitle({ commit }, title) {
    state.title = title
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

