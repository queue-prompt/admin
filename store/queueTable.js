import timeslotsApi from '../APIs/timeslots'

export const state = () => ({
  createdDate: {}
})

export const mutations = {
  setState(state, { key, value }) {
    state[key] = value
  },

  mutateActiveOpen(state, { date, isActive }) {
    const { createdDate } = state
    createdDate[date].active = isActive
  }
}

export const actions = {
  async init ({ dispatch }) {
    await dispatch('fetchCreatedDate')
  },

  async fetchCreatedDate({ commit, rootState }) {
    const { entityId } = rootState.user

    let res = await timeslotsApi()._getAll(entityId);
    commit('setState', { value: res.data || {}, key: 'createdDate' })
  }
}

export const getters = {}