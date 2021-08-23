import axios from '../instances/axios'
import { databaseEndpoint } from './endpoints'

const informationApi = () => {
  const baseEnpoint = databaseEndpoint

  const _create = (entityId, type, text) => {
    const fullEnpoint = `${baseEnpoint}/information`
    const payload = { entityId, type, text }
    return axios.post(fullEnpoint, payload)
  }

  const _get = (entityId, type) => {
    const fullEnpoint = `${baseEnpoint}/information/${entityId}/${type}`
    return axios.get(fullEnpoint)
  }

  return {
    _create,
    _get
  }
}

export default informationApi
