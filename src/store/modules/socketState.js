export default {
  state: {
    ws: null
  },
  getters: {
    wsIsOpen: state => {
      return state.ws && state.ws.readyState === 1
    }
  },
  mutations: {
    createSocket (state) {
      if (state.ws) return
      state.ws = new WebSocket(process.env.VUE_APP_SOCKET)
    }
  },
  actions: {

  }
}
