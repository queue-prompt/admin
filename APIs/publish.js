import axios from '../instances/axios'
import {cloudFunctionEndpoint} from './endpoints'

const publishApi = () => {

  const _getQrLink = (entityId) => {
    const endPoint = cloudFunctionEndpoint + '/qrcode'
    return axios.post(endPoint, { entityId })
  }

  return {
    _getQrLink
  }
}

export default publishApi
