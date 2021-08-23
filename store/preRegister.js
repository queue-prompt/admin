import informationApi from '../APIs/information'
const type = 'pre_register'

export const state = () => ({
  text: ''
})

export const mutations = {
  setState (state, { key, value }) {
    state[key] = value
  }
}

export const actions = {
  init ({ dispatch }) {
    dispatch('get')
  },

  async get ({ rootState, commit }) {
    const { entityId } = rootState.user
    const { data: resData } = await informationApi()._get(entityId, type)
    if(resData && resData.text) {
      commit('setState', { key: 'text', value: resData.text })
    } else {
      commit('setState', { key: 'text', value: 'Pre Register' })
    }
  },

  saveText ({ commit, rootState }, text) {
    const { entityId } = rootState.user
    commit('setState', { key: 'text', value: text })
    return informationApi()._create(entityId, type, text)
  }
}
