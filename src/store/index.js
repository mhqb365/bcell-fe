import { createStore } from 'vuex'
import jwt_decode from 'jwt-decode'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    permission: 0,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updatePermission(state, payload) {
      // console.log(payload)
      state.permission = payload
    },
  },
  actions: {
    async getPermission(context) {
      try {
        let permission = 0
        if (localStorage.getItem('token')) {
          let decoded = jwt_decode(localStorage.getItem('token'))
          // console.log(decoded)
          permission = decoded.permission
        }
        // console.log(permission)
        context.commit('updatePermission', permission)
      } catch (error) {
        // console.error(error)
      }
    },
  },
  modules: {},
})
