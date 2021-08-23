import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import reportApi from '../APIs/report'

export const state = () => ({
  data: []
})

export const mutations = {
  setState (state, { stateName, value }) {
    state[stateName] = value
  }
}

export const actions = {
  async fetchReport ({ rootState, commit }, date) {
    if (!date) {
      date = dayjs().format('YYYY-MM-DD')
    }
    const { data } = await reportApi()._post(rootState.user.entityId, date)
    commit('setState', { stateName: 'data', value: data.list })
  },
  async getReport ({ rootState, dispatch }, { date, reportType }) {
    try {
      dispatch('appState/toggleIsLoading', null, { root: true })
      let getData
      const { entityId } = rootState.user
      if (reportType === 'excel') {
        getData = await reportApi()._getExcelReport(entityId, date)
      } else {
        getData = await reportApi()._getPDFReport(entityId, date)
      }
      const downloadLink = getData.data
      FileSaver.saveAs(downloadLink, 'report')
    } catch (error) {
      dispatch(
        'appState/toggleNotification',
        { content: 'error occured', type: 'error', delay: 2000 },
        { root: true }
      )
    } finally{
      dispatch('appState/toggleIsLoading', null, { root: true })
    }
  }
}
