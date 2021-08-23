const ExcelJs = require ('exceljs')
const {calAge,convertTimeRangeFormat} =require('../helperFunction/function')

class Report{
  workbook =new ExcelJs.Workbook()
    
  constructor(worksheetName,entityName,summaryData){
    this.main(worksheetName,entityName,summaryData)
  }

  async main(worksheetName,entityName,summaryData){
    const {date,list} =summaryData
    const sheetId = this.addWorksheet(worksheetName)
    this.genReportHeader(sheetId,date,entityName,list)
    if(list.length>0){
      this.genReportContent(sheetId,date,list)
    }
    this.adjustStyle(sheetId)
  }

  addWorksheet(worksheetName){
      const {id} = this.workbook.addWorksheet(worksheetName,{pageSetup:{paperSize:9}})
      return id
  }

  genReportHeader(sheetId,dataDate,entityName,list){
      const now = new Date()
      const headerRows =[
        [`หน่วยงาน: ${entityName}`],
        [`รายงานของวันที่: ${dataDate}`],
        [`เอกสารสร้างเมื่อ: ${now.toLocaleString()}`],
        [`ผู้ลงทะเบียนทั้งหมด: ${list.length} คน`],
        ['']
      ]
      this.workbook.getWorksheet(sheetId).addRows(headerRows)
  }

  genReportContent(sheetId,reportDate,dataList){
      const contentHeader = ['ลำดับ','รหัสการจอง','ช่วงเวลาการจอง','รหัสบัตรประชาชน','ชื่อ-นามสกุล','เพศ','อายุ','เบอร์โทรศัพท์','จังหวัด']
      this.workbook.getWorksheet(sheetId).addRow(contentHeader)
      for(const [index,data] of dataList.entries()){
        const {prefix,firstName,lastName,idCardNumber,birthDate,time,mobile,registerCode,gender,province} =data
        const rowData =[]
        for(let i =0; i<contentHeader.length;i++){
          switch(contentHeader[i]){
              case 'ชื่อ-นามสกุล':
                rowData.push(`${prefix} ${firstName} ${lastName}`)
                break;
              case 'ลำดับ':
                rowData.push(`${index+1}.`)
                break;
              case 'รหัสบัตรประชาชน':
                rowData.push(idCardNumber)
                break;
              case 'อายุ':
                const {year,month} = calAge(birthDate)
                if(month){
                  rowData.push(`${year} ปี ${month} เดือน`)
                }else{
                  rowData.push(`${year} ปี`)
                }
                break;
              case 'รหัสการจอง':
                rowData.push(registerCode)
                break;
              case 'ช่วงเวลาการจอง':
                rowData.push(`${convertTimeRangeFormat(time)}    ${reportDate}`)
                break;
              case 'เบอร์โทรศัพท์':
                rowData.push(mobile)
                break;
              case 'เพศ':
                if(gender == 'male'){
                  rowData.push('ชาย')
                }else{
                  rowData.push('หญิง')
                }
                break;
              case 'จังหวัด':
                rowData.push(province)
              default:
                break;
          }
        } 
        this.workbook.getWorksheet(sheetId).addRow(rowData)
      }
  }

  adjustStyle(sheetId){
    this.workbook.getWorksheet(sheetId).eachRow((row,rowNumber)=>{
      if(rowNumber<6){
        row.height = 30
        row.eachCell((cell)=>{
          cell.style={
            font:{size:16}
          }
        })
      }
      if(rowNumber>=6){
        row.height= 30
        row.alignment ={vertical:'middle'}
        row.eachCell((cell)=>{
          cell.style.font = 13
          cell.border ={
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          }
        })
        if(rowNumber%2!==0 && rowNumber>6){
          row.eachCell((cell)=>{
              cell.style.fill={
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb:'d3d3d3' }
              };
          })
        }
      }
  })
    this.workbook.getWorksheet(sheetId).getColumn(1).width = 5
    this.workbook.getWorksheet(sheetId).getColumn(2).width = 15
    this.workbook.getWorksheet(sheetId).getColumn(3).width = 31
    this.workbook.getWorksheet(sheetId).getColumn(4).width = 20
    this.workbook.getWorksheet(sheetId).getColumn(5).width = 34
    this.workbook.getWorksheet(sheetId).getColumn(6).width = 10
    this.workbook.getWorksheet(sheetId).getColumn(7).width = 15
    this.workbook.getWorksheet(sheetId).getColumn(8).width = 20
    this.workbook.getWorksheet(sheetId).getColumn(9).width = 20
    this.workbook.getWorksheet(sheetId).views =[{state:'frozen',xSplit: 9,ySplit: 6}]
  }

  writeBuffer(){
    return new Promise(async (resolve,reject)=>{
      try{
       const buffer = await this.workbook.xlsx.writeBuffer()
        resolve(buffer)
      }catch(error){
        reject(error)
      }
    })
  }
}

module.exports = Report