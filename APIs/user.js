import axios from '../instances/axios'
import {databaseEndpoint} from './endpoints'

const userApi = () => {

  const _get = (uid) => {
    const endPoint = databaseEndpoint + `/users/${uid}`
    return axios.get(endPoint)
  }

  const _post = (userInfo) => {
    const endPoint = databaseEndpoint + '/users'
    return axios.post(endPoint, userInfo)
  }

  const _getEntity = (entityId) => {
    const endPoint = databaseEndpoint + `/entity/${entityId}?ts=${new Date().valueOf()}`
    return axios.get(endPoint)
  }

  const _postEntity = (entityInfo) => {
    const endPoint = databaseEndpoint + '/entity'
    return axios.post(endPoint, entityInfo)
  }

  const _putEntity = (updatePayload) => {
    const endPoint = databaseEndpoint + '/entity'
    return axios.put(endPoint, updatePayload)
  }

  return {
    _get,
    _post,
    _getEntity,
    _postEntity,
    _putEntity
  }
}

export default userApi
