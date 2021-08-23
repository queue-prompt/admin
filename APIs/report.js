import axios from '../instances/axios'
import {databaseEndpoint, cloudFunctionEndpoint} from './endpoints'

const reportApi = () => {
  const _post = (entityId, date) => {
    const endPoint = databaseEndpoint + '/report/reserved'
    return axios.post(endPoint, { entityId, date })
  }

  const _getExcelReport = (entityId, date) => {
    const endPoint = cloudFunctionEndpoint + '/excelReport'
    return axios.post(endPoint, { entityId, date })
  }

  const _getPDFReport = (entityId, date) => {
    const endPoint = cloudFunctionEndpoint + '/pdfReport'
    return axios.post(endPoint, { entityId, date })
  }

  return {
    _post,
    _getExcelReport,
    _getPDFReport
  }
}

export default reportApi
