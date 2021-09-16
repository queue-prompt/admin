const { firestore, functions } = require('../config/firebase')
const cors = require('cors')({ origin: "*" })
const Axios = require('axios')

function getEmail(entityId) {
  const p = new Promise(async (resolve, reject) => {
    try {
      const response = await Axios.get('https://api.xn--42c6cjhs2b6b5k.com/v1' + `/entity/${entityId}`)

      const data = response.data
      resolve(data.citizenContact.email)
    }

    catch(error) {
      console.log(error)
      reject()
    }
  })

  return p
}


exports.reserveNotification = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const formData = req.body
    const emailNoti = await getEmail(formData.entityId)

    if(emailNoti == '') {
      res.status(200).send('email notification is empty')
      return 
    }

    const replaceSpace = emailNoti.replace(/\s/g, '');
    const emailList = replaceSpace.split(',');
    const timeSplit = formData.time.split('-')
    const timeFirst = `${timeSplit[0][0]}${timeSplit[0][1]}:${timeSplit[0][2]}${timeSplit[0][3]}`
    const timeLast = `${timeSplit[1][0]}${timeSplit[1][1]}:${timeSplit[1][2]}${timeSplit[1][3]}`
    const reserveTime = `${timeFirst}-${timeLast}`

    firestore
    .collection("mail")
    .add({
        to: emailList,
        message: {
          subject: `แจ้งเตือน มีผู้จองคิวใหม่จากระบบคิวพร้อม [${formData.registerCode ? formData.registerCode : ''}]`,
          html: `
          <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
            <head>
            <title></title>
            <meta charset="utf-8"/>
            <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css"/>
            <link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet" type="text/css"/>
            <!--<![endif]-->
            <style>
                * {
                  box-sizing: border-box;
                }
            
                th.column {
                  padding: 0
                }
            
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: inherit !important;
                }
            
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                }
            
                p {
                  line-height: inherit
                }
            
                @media (max-width:700px) {
                  .icons-inner {
                    text-align: center;
                  }
            
                  .icons-inner td {
                    margin: 0 auto;
                  }
            
                  .fullMobileWidth,
                  .row-content {
                    width: 100% !important;
                  }
            
                  .image_block img.big {
                    width: auto !important;
                  }
            
                  .stack .column {
                    width: 100%;
                    display: block;
                  }
                }
              </style>
            </head>
            <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 15px;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #10a254;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #10a254;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td colspan="3" style="font-size:7px;height:15px;background-color:transparent" width="100%"></td>
            </tr>
            <tr>
            <td style="width:15px;background-color:transparent"> </td>
            <td style="width:650px;">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #787771; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; text-align: center;"><span style="font-size:20px;color:#ffffff;"><strong>แจ้งเตือน มีผู้จองคิวใหม่จากระบบคิวพร้อม</strong></span></p>
            <p style="margin: 0; mso-line-height-alt: 14.399999999999999px;"><br/></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </td>
            <td style="width:15px;background-color:transparent"> </td>
            </tr>
            <tr>
            <td colspan="3" style="font-size:7px;height:15px;background-color:transparent" width="100%"></td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 10px; padding-right: 10px;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #44464a; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;"><span style="font-size:18px;"><strong>ข้อมูลผู้จองคิว</strong></span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>

            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tbody><tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tbody><tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </tbody></table>
            </div>
            </td>
            </tr>
            </tbody></table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>

          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
          <tbody>
          <tr>
          <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
          <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
          <tbody><tr>
          <td style="padding-bottom:15px;padding-left:10px;padding-top:15px;">
          <div style="font-family: sans-serif">
          <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
          <p style="margin: 0; font-size: 16px;">รหัสจองคิว</p>
          </div>
          </div>
          </td>
          </tr>
          </tbody></table>
          </th>
          <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
          <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
          <tbody><tr>
          <td style="padding-bottom:15px;padding-right:10px;padding-top:15px;">
          <div style="font-family: sans-serif">
          <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
          <p style="margin: 0; font-size: 16px; text-align: right;">${formData.registerCode ? formData.registerCode : '-'}</p>
          </div>
          </div>
          </td>
          </tr>
          </tbody></table>
          </th>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>

          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
          <tbody>
          <tr>
          <td>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
          <tbody>
          <tr>
          <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
          <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
          <tbody><tr>
          <td style="padding-top:5px;padding-bottom:5px;">
          <div align="center">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
          <tbody><tr>
          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
          </tr>
          </tbody></table>
          </div>
          </td>
          </tr>
          </tbody></table>
          </th>
          </tr>
          </tbody>
          </table>
          </td>
          </tr>
          </tbody>
          </table>


            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tbody><tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;">จองคิว</p>
            </div>
            </div>
            </td>
            </tr>
            </tbody></table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tbody><tr>
            <td style="padding-bottom:15px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px; text-align: right;">${formData.date ? formData.date : '-'}</p>
            <p style="margin: 0; font-size: 16px; text-align: right;">${reserveTime ? reserveTime : '-'} น.</p>
            </div>
            </div>
            </td>
            </tr>
            </tbody></table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>

            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;">ชื่อ</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px; text-align: right;">${formData.firstName ? formData.firstName : ''} ${formData.lastName ? formData.lastName : '-'}</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;">กลุ่ม</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:5px;padding-right:5px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px; text-align: right;"> ${formData.groupOf ? formData.groupOf : '-'}</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;">เลขบัตรประชาชน</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:5px;padding-right:5px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px; text-align: right;"> ${formData.idCardNumber ? formData.idCardNumber : '-'}</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;"><span style="font-size:16px;">เบอร์โทรศัพท์</span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p dir="ltr" style="margin: 0; font-size: 16px; text-align: right;"> ${formData.mobile ? formData.mobile : '-'}</p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 5px; padding-right: 5px;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px;"><span style="font-size:16px;">ข้อมูลเพิ่มเติม</span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="50%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #393d47; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; font-size: 16px; text-align: right;"><span style="font-size:16px;"> ${formData.remark ? formData.remark : '-'}</span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #ffffff;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E1ECEF;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-top:5px;padding-bottom:5px;">
            <div align="center">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td class="divider_inner" height="25" style="font-size: 1px; line-height: 1px; border-top: 0px solid transparent;"><span></span></td>
            </tr>
            </table>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #10a254;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #10a254;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;">
            <div style="font-family: sans-serif">
            <div style="font-size: 12px; color: #b2b2b2; line-height: 1.2; font-family: Nunito, Arial, Helvetica Neue, Helvetica, sans-serif;">
            <p style="margin: 0; text-align: center;"><span style="color:#ffffff;">© 2021 Powered by คิวพร้อม.com</span></p>
            <p style="margin: 0; text-align: center;"><span style="color:#ffffff;">v 1.2.1</span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-17" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="680">
            <tbody>
            <tr>
            <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="padding-bottom:10px;padding-top:10px;color:#9d9d9d;font-family:inherit;font-size:15px;text-align:center;">
            <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
            <tr>
            <td style="text-align:center;">
            <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
            <!--[if !vml]><!-->
            <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
            <!--<![endif]-->
            </table>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </th>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table><!-- End -->
            </body>
          </html>
          `,
        },
      })
      .then(() => {
        console.log("delivery user reserve queue notification email to system admin")
        res.status(200).send('send email success')
      })
      .catch((err)=> {
        console.log('error occured',err)
        res.status(500).send(err)
      })
  })
})