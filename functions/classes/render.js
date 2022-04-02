const { calAge,convertTimeRangeFormat } = require('../helperFunction/function')
const moment = require('moment')

const renders ={
  reportTableHeader : [
    { 
      text: 'ลำดับ',
      style: 'tableContentStyle',
      renderContent:(index)=>`${index+1}.`
    },
    { 
      text: 'รหัสการจอง',
      style: 'tableContentStyle',
      renderContent:(data)=>data.registerCode?`${data.registerCode}`:''
    },
    { 
      text: 'ช่วงเวลาการจอง',
      style: 'tableContentStyle',
      renderContent:(data)=>data.time?`${convertTimeRangeFormat(data.time)}`:''
    },
    { 
      text: 'รหัสบัตรประชาชน',
      style: 'tableContentStyle',
      renderContent:(data)=>data.idCardNumber?`${data.idCardNumber}`:''
    },
    { 
      text: 'ชื่อ-นามสกุล',
      style: 'tableContentStyle',
      renderContent:({prefix='',firstName='',lastName=''})=> `${prefix} ${firstName} ${lastName}` 
    },
    { 
      text: 'เพศ',
      style:'tableContentStyle',
      renderContent:(data)=>{
        if(data.gender){
          if(data.gender ==='male'){
            return  'ชาย'
          }else{
            return 'หญิง'
          }
        }else{
          return ''
        }
      }
    },
    { 
      text: 'อายุ',
      style:'tableContentStyle',
      renderContent:(data)=>{
        if(data.birthDate){
          const { year, month } = calAge(data.birthDate)
          if (month) {
            return `${year}Y ${month}M`
          } else {
            return `${year}Y`
          }
        }else{
          return ''
        }
      }
    },
    {
      text: 'วัน/เดือน/ปีเกิด',
      style: 'tableContentStyle',
      renderContent: (data) => {
        if(data.birthDate) {
          return moment(data.birthDate).format('DD/MM/YYYY')
        } else {
          return ''
        }
      }
    },
    { 
        text: 'เบอร์โทรศัพท์',
        style: 'tableContentStyle',
        renderContent:(data)=>data.mobile?`${data.mobile}`:''
    },
    {
      text:'กลุ่ม',
      style:'tableContentStyle',
      renderContent:(data)=>data.groupOf?`${data.groupOf}`:''
    },
    {
      text:'ข้อมูลเพิ่มเติม',
      style:'tableContentStyle',
      renderContent:(data)=>data.remark?`${data.remark}`:''
    }
  ]
}

module.exports = renders