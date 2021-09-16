const fs = require('fs').promises
const QRcode =require('qrcode')
const {bucket} =require('../config/firebase')
const dayjs  =require('dayjs')
const {clientAppUrl} =require('../constant/constant')

function writeFile(dir,filename,content){
  fs.mkdir(dir, { recursive: true }).catch(error => { console.error('caught exception : ', error.message); });
  return fs.writeFile(dir+'/'+filename,content)
}

function generateQRImage(filePath,entityId){
  return new Promise((resolve,reject)=>{
    const QrStyle= {
      type:'png', quality: 0.3,
      margin: 1,
      width:1000,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      } 
    }
      QRcode.toFile(filePath,`${clientAppUrl}?entityId=${entityId}`,QrStyle,(err)=>{
        if(err){
          reject(err)
        }else{
          resolve()
        }
      })
  }) 
}

function uploadFile(filePath,destination,contentType){
  return new Promise(async (resolve,reject)=>{
    try{
      const data =await bucket.upload(filePath,{
        destination,
        uploadType: "media",
        public: true,
        metadata: {
          contentType
        }
      })
      let file = data[0]
      const uploadLink = file.metadata.mediaLink
      console.log('successfully upload')
      resolve(uploadLink)
    }catch(error){
      console.log('failed to upload')
      reject(error)
    }
  })
}

function calAge(birthDate){
  const now =dayjs()
  const diffDay = now.diff(birthDate, 'day')
  const year = Math.round(diffDay/365)
  const month =Math.round((diffDay%365)/30)
  return {year,month}
}

function convertTimeRangeFormat(time){
  const startTime = time.slice(0,4)

  const endTime = time.slice(5,9)
  
  const formatTime =(time)=> {return [time.substring(0,2),':',time.substring(2,4)].join('').toString()}

  return `${formatTime(startTime)}-${formatTime(endTime)}`
}


module.exports={
  writeFile,
  generateQRImage,
  uploadFile,
  calAge,
  convertTimeRangeFormat,
}