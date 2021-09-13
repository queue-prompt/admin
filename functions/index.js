const cors = require('cors')({ origin: "*" })
const fs = require('fs').promises
const os = require('os')
const path =require('path')
const ReportExcel = require("./classes/reportExcel")
const ReportPDF = require("./classes/pdf.publish.report")
const Axios = require('axios')
const dayjs =require('dayjs')
const { firestore,bucket, functions } = require('./config/firebase')
const { databaseUrl,systemAdminEmail} = require('./constant/constant')
const { writeFile, generateQRImage, uploadFile } = require('./helperFunction/function')
const { v4: uuidV4 } = require('uuid')

const tmp = os.tmpdir()

exports.qrcode = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (true) {
      try {
        const { entityId } = req.body
        const destinationPath = `${entityId}/clientQr.png`
        const tmpFileName = `${uuidV4()}.png`
        const tmpPath = path.join(tmp,tmpFileName)
        const file = bucket.file(destinationPath)
        const exists = await file.exists()
        if (exists[0]) {
          const data = await file.getMetadata()
          const { mediaLink } = data[0]
          const imageLink = mediaLink
          console.log(imageLink)
          res.status(200).send(imageLink)
        } else {
          generateQRImage(tmpPath, entityId)
          const imageLink = await uploadFile(tmpPath, destinationPath, 'image/png')
          await fs.unlink(tmpPath)
          res.status(200).send(imageLink)
        }
      } catch (error) {
        console.log(error)
        res.status(500).send('internal server error')
      }
    } else {
      res.status(404).send('not found')
    }
  })
})


exports.pdfReport = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (true) {
      try {
        const { entityId, date, type } = req.body
        const { authorization } = req.headers
        const { data } = await Axios.post(databaseUrl + '/report/reserved', { entityId, date }, { headers: { authorization } })
        const { data: entityData } = await Axios.get(databaseUrl + `/entity/${entityId}?ts=${new Date().valueOf()}`, { headers: { authorization } })
        const tmpFileName = `${uuidV4()}.pdf`
        const tmpPath = path.join(tmp,tmpFileName)
        const destinationPath = `${entityId}/รายงาน.pdf`
        const pdf = new ReportPDF()
        await pdf.main(entityData.organization, data, tmpFileName,type)
        const downloadLink = await uploadFile(tmpPath, destinationPath, 'application/pdf')
        await fs.unlink(tmpPath)
        res.status(200).send(downloadLink)
      } catch (error) {
        console.log(error)
        res.status(500).send('internal server error')
      }
    } else {
      res.status(404).send('not found')
    }
  })
})


exports.excelReport = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (true) {
      try {
        const { entityId, date, type } = req.body
        const { authorization } = req.headers
        const { data } = await Axios.post(databaseUrl + '/report/reserved', { entityId, date }, { headers: { authorization } })
        const { data: entityData } = await Axios.get(databaseUrl + `/entity/${entityId}?ts=${new Date().valueOf()}`, { headers: { authorization } })
        const tmpFileName = `${uuidV4()}.xlsx`
        const tmpPath = path.join(tmp,tmpFileName)
        const destinationPath = `${entityId}/รายงาน.xlsx`
        const report = new ReportExcel('รายงานประจำวัน', entityData.organization, data,type)
        const buffer = await report.writeBuffer()
        await writeFile(tmp, tmpFileName, buffer)
        const downloadLink = await uploadFile(tmpPath, destinationPath, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        await fs.unlink(tmpPath)
        res.status(200).send(downloadLink)
      } catch (error) {
        console.log(error)
        res.status(500).send('internal server error')
      }
    } else {
      res.status(404).send('not found')
    }
  })
})


exports.onCreateUser = functions.auth.user().onCreate((user)=>{
 firestore
 .collection("mail")
 .add({
    to: systemAdminEmail,
    message: {
      subject: "แจ้งเตือน มีผู้สมัครใหม่จากระบบคิวพร้อม",
      html: `
      <body>
      <h1>แจ้งเตือนมีผู้ใช้งานใหม่</h1>
      <h3>ข้อมูลผู้ใช้งานใหม่</h3>
      <p>อีเมล ${user.email}</p>
      <p>สมัครเข้าระบบคิวพร้อมวันที่ ${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>รหัสผู้ใช้งาน ${user.uid}</p>
      </body>
      `,
    },
  })
  .then(() => console.log("delivery user create notification email to system admin"))
  .catch((err)=> console.log('error occured',err))
})