import { auth } from '~/instances/firebase'


export const state = () => ({
  user: null,
  loadComplete: false,
  isSignout: false
})

export const mutations = {
  setState(state, { key, value }) {
    state[key] = value
  }
}

export const actions = {
  onAuthChange({ commit }) {


    // hace to new implement
    auth.onAuthStateChanged(user => {

      commit('setState', { key: 'loadComplete', value: true })

      if (user) {
        commit('setState', { key: 'user', value: user.uid })
        this.$router.push('/')
      }
      else {
        commit('setState', { key: 'user', value: null })
        this.$router.push('/login')
      }

    })
  },

  async signout({ commit }) {
    await auth.signOut();
    commit('setState', { key: 'isSignout', value: true })
    window.location.reload();
  }


}
