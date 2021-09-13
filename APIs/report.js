import axios from '../instances/axios'
import {databaseEndpoint, cloudFunctionEndpoint} from './endpoints'

const reportApi = () => {
  const _post = (entityId, date) => {
    const endPoint = databaseEndpoint + '/report/reserved'
    return axios.post(endPoint, { entityId, date })
  }

  const _getExcelReport = (entityId, date, type) => {
    const endPoint = cloudFunctionEndpoint + '/excelReport'
    return axios.post(endPoint, { entityId, date, type })
  }

  const _getPDFReport = (entityId, date, type) => {
    const endPoint = cloudFunctionEndpoint + '/pdfReport'
    return axios.post(endPoint, { entityId, date, type })
  }

  return {
    _post,
    _getExcelReport,
    _getPDFReport
  }
}

export default reportApi
