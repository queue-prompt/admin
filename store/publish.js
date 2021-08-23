import fileSaver from 'file-saver'
import publishApi from '~/APIs/publish'

const baseClientLink = 'https://liff.line.me/1656257347-RrNWv1p3?entityId='
const LINK = 'https://คิวพร้อม.com?e='

export const state = () => ({
  webLink: LINK,
  webLink2: baseClientLink,

})

export const mutations = {
  setState(state, { stateName, value }) {
    state[stateName] = value
  }
}

export const actions = {
  async downloadQrImage({ rootState, dispatch }) {
    try {
      dispatch('appState/toggleIsLoading', null, { root: true })
      const downloadData = await publishApi()._getQrLink(rootState.user.entityId)
      const downloadLink = downloadData.data
      if (downloadLink) {
        fileSaver.saveAs(downloadLink, 'QR')
      }
    } catch (error) {
      dispatch(
        'appState/toggleNotification',
        { content: 'error occured', type: 'error', delay: 2000 },
        { root: true }
      )
    }finally{
      dispatch('appState/toggleIsLoading', null, { root: true })
    }
  }
}
