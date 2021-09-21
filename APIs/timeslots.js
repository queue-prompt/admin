import axios from '../instances/axios'
import { databaseEndpoint } from './endpoints'

const timeSlotApi = () => {
  const baseEnpoint = databaseEndpoint

  const _create = (entityId, dateList, timeslots) => {
    const fullEnpoint = baseEnpoint + '/timeslots'
    const payload = { entityId, dateList, timeslots }
    return axios.post(fullEnpoint, payload)
  }

  const _get = async (entityId, date) => {
    const fullEndpoint = `${baseEnpoint}/timeslots/${entityId}/${date}?ts=${new Date().valueOf()}`
    return axios.get(fullEndpoint)
  }

  const _getAll = async (entityId) => {
    const fullEndpoint = `${baseEnpoint}/timeslots/${entityId}?ts=${new Date().valueOf()}`
    return axios.get(fullEndpoint)
  }

  const _update = (entityId, payload) => {
    const fullEndpoint = `${baseEnpoint}/timeslots`
    const showPayload = {
      entityId,
      ...payload
    }

    return axios.put(fullEndpoint, showPayload)
  }

  const _delete =(entityId,date) =>{
    const fullEndpoint = `${baseEnpoint}/timeslots`
    const payload = {entityId,date}
    return axios.delete(fullEndpoint,{data:payload})
  }

  return {
    baseEnpoint,
    _create,
    _get,
    _getAll,
    _update,
    _delete
  }
}

export default timeSlotApi
