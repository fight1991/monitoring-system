export default {
  namespaced: true,
  state () {
    return {
      plantInfo: {
        plantName: '',
        country: '',
        city: ''
      }
    }
  },
  mutations: {
    setCountryAndCity (state, load) {
      state.plantInfo = load
    }
  }
}
