

export const state = () => ({
  isLoading: false
})

export const mutations = {
  setState(state, { key, value }) {
    state[key] = value
  }
}

export const actions = {
  toggleIsLoading({ state, commit }) {
    const { isLoading } = state
    commit('setState', { key: 'isLoading', value: !isLoading })
  },
  toggleNotification({ state }, { content, type, delay }) {
    if (type === 'error') {
      this.$toast.error(content, {
        duration: delay || 2000
      })
    } else {
      this.$toast.success(content, {
        duration: delay || 2000
      })
    }
  },


}
