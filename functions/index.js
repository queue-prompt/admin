const express = require("express");
const cors = require("cors")({ origin: "*" });
const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const ReportExcel = require("./classes/reportExcel");
const ReportPDF = require("./classes/pdf.publish.report");
const Axios = require("axios");
const { firestore, bucket, functions } = require("./config/firebase");
const { databaseUrl, systemAdminEmail } = require("./constant/constant");
const {
  reserveEmailNotificationTemplate,
  userApplyNotificationEmailTemplate
} = require("./templates/email");
const {
  writeFile,
  generateQRImage,
  uploadFile
} = require("./helperFunction/function");
const { v4: uuidV4 } = require("uuid");

const tmp = os.tmpdir();

const qrCodeApp = express().use(cors);
const reportExcelApp = express().use(cors);
const reportPDfApp = express().use(cors);
const reserveNotificationApp = express().use(cors);


exports.qrcode = functions.https.onRequest(
  qrCodeApp.post("/", async (req, res) => {
    try {
      const { entityId } = req.body;
      const destinationPath = `${entityId}/clientQr.png`;
      const tmpFileName = `${uuidV4()}.png`;
      const tmpPath = path.join(tmp, tmpFileName);
      const file = bucket.file(destinationPath);
      const exists = await file.exists();
      if (exists[0]) {
        const data = await file.getMetadata();
        const { mediaLink } = data[0];
        const imageLink = mediaLink;
        console.log(imageLink);
        res.status(200).send(imageLink);
      } else {
        generateQRImage(tmpPath, entityId);
        const imageLink = await uploadFile(
          tmpPath,
          destinationPath,
          "image/png"
        );
        await fs.unlink(tmpPath);
        res.status(200).send(imageLink);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error");
    }
  })
);

exports.pdfReport = functions.https.onRequest(
  reportPDfApp.post("/", async (req, res) => {
    try {
      const { entityId, date, type } = req.body;
      const { authorization } = req.headers;
      const { data } = await Axios.post(
        databaseUrl + "/report/reserved",
        { entityId, date },
        { headers: { authorization } }
      );
      const { data: entityData } = await Axios.get(
        databaseUrl + `/entity/${entityId}?ts=${new Date().valueOf()}`,
        { headers: { authorization } }
      );
      const tmpFileName = `${uuidV4()}.pdf`;
      const tmpPath = path.join(tmp, tmpFileName);
      const destinationPath = `${entityId}/รายงาน.pdf`;
      const pdf = new ReportPDF();
      await pdf.main(entityData.organization, data, tmpFileName, type);
      const downloadLink = await uploadFile(
        tmpPath,
        destinationPath,
        "application/pdf"
      );
      await fs.unlink(tmpPath);
      res.status(200).send(downloadLink);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error");
    }
  })
);

exports.excelReport = functions.https.onRequest(
  reportExcelApp.post("/", async (req, res) => {
    try {
      const { entityId, date, type } = req.body;
      const { authorization } = req.headers;
      const { data } = await Axios.post(
        databaseUrl + "/report/reserved",
        { entityId, date },
        { headers: { authorization } }
      );
      const { data: entityData } = await Axios.get(
        databaseUrl + `/entity/${entityId}?ts=${new Date().valueOf()}`,
        { headers: { authorization } }
      );
      const tmpFileName = `${uuidV4()}.xlsx`;
      const tmpPath = path.join(tmp, tmpFileName);
      const destinationPath = `${entityId}/รายงาน.xlsx`;
      const report = new ReportExcel(
        "รายงานประจำวัน",
        entityData.organization,
        data,
        type
      );
      const buffer = await report.writeBuffer();
      await writeFile(tmp, tmpFileName, buffer);
      const downloadLink = await uploadFile(
        tmpPath,
        destinationPath,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      await fs.unlink(tmpPath);
      res.status(200).send(downloadLink);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error");
    }
  })
);

exports.reserveNotification = functions.https.onRequest(
  reserveNotificationApp.post('/',async(req,res)=>{
    try{
      const formData = req.body;
      const { authorization } = req.headers;
      const { data } = await Axios.get(
        databaseUrl + `/entity/${formData.entityId}?ts=${new Date().valueOf()}`,
        { headers: { authorization } }
      );
      const emailNoti = data.citizenContact.email;
  
      if (emailNoti == "") {
        res.status(200).send("email notification is empty");
        return;
      }
  
      const replaceSpace = emailNoti.replace(/\s/g, "");
      const emailList = replaceSpace.split(",");
      const timeSplit = formData.time.split("-");
      const timeFirst = `${timeSplit[0][0]}${timeSplit[0][1]}:${timeSplit[0][2]}${timeSplit[0][3]}`;
      const timeLast = `${timeSplit[1][0]}${timeSplit[1][1]}:${timeSplit[1][2]}${timeSplit[1][3]}`;
      const reserveTime = `${timeFirst}-${timeLast}`;
      const template = reserveEmailNotificationTemplate(
        emailList,
        formData,
        reserveTime
      );
      await firestore.collection("mail").add(template)
      res.status(200).send("send email success");
    }catch(error){
      console.log(error);
      res.status(500).send("internal server error");
    }
  })
  );

exports.onCreateUser = functions.auth.user().onCreate(user => {
  const template = userApplyNotificationEmailTemplate(systemAdminEmail, user);
  firestore
    .collection("mail")
    .add(template)
    .then(() =>
      console.log("delivery user create notification email to system admin")
    )
    .catch(err => console.log("error occured", err));
});
