import fileSaver from 'file-saver'
import publishApi from '~/APIs/publish'
import QRCode from 'qrcode';

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
  async generateQrCode({ rootState, dispatch }) {
    const entityId = rootState.user.entityId
    const url = `https://xn--42c6cjhs2b6b5k.com/?e=` + entityId
    // const url = `https://คิวพร้อม.com?e=` + entityId

    try {
      const qrcodeUrl = await QRCode.toDataURL(url, {
        width: 1000,
        margin: 1,
      });

      return qrcodeUrl
    } catch(err) {
      console.log(err)
    }
  },
  async downloadQrImage({ rootState, dispatch }) {
    try {
      dispatch('appState/toggleIsLoading', null, { root: true })
      const entityId = rootState.user.entityId
      const qrcodeURL = await dispatch('generateQrCode')

      const a = document.createElement('a');
      a.href = qrcodeURL;
      a.download = `QRCode-${entityId}.png`; // Name of the downloaded file
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // -- old and generate fail ---
      // const downloadData = await publishApi()._getQrLink(rootState.user.entityId)
      // const downloadLink = downloadData.data
      // if (downloadLink) {
      //   fileSaver.saveAs(downloadLink, 'QR')
      // }
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
