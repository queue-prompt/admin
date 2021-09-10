const  PDF = require('./pdf') 
const {ReportPdfStyle} = require('./pdf.styles') 
const { calAge,convertTimeRangeFormat } = require('../helperFunction/function')

const tableLayout = {
  zebraLayout: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return (i === node.table.headerRows) ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#aaa';
    },
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return (i === node.table.widths.length - 1) ? 0 : 8;
    },
    fillColor: function (i, node) {
      return (i % 2 !== 0) ? '#CCCCCC' : null;
    }
  }
}




class ReportPDF extends PDF{
  tableHeaders =[
    { 
      text: 'ลำดับ',
      style: 'tableContentStyle',
      renderContent:(index)=>`${index+1}`
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

  constructor(){
    super()
  }

  main(entityName, summaryData, fileName){
    this.setPageStyle()
    this.createReportHeader(entityName,summaryData)
    if(summaryData.list.length>0){
      this.createReportTable(summaryData.list)
    }
    this.docDefinition.content.push({ text: `ผู้ลงทะเบียนทั้งหมด: ${summaryData.list.length} คน`, style: 'tableContentStyle', margin: [0, 10, 0, 0] })
    return this.buildPdf(fileName,this.docDefinition)
  }

  setPageStyle(){
    this.docDefinition.styles = ReportPdfStyle
    this.docDefinition.pageOrientation = 'landscape'
  }

  createReportHeader(entityName,summaryData){
    const { date, list } = summaryData
    const now = new Date()
    const columns = [
      {
        width: '*',
        stack: []
      },
      {
        width: '*',
        stack: []
      }
    ]
    this.docDefinition.content.push({ columns })
    this.docDefinition.content[0].columns[0].stack.push({ text: `หน่วยงาน: ${entityName}`, style: 'header' })
    this.docDefinition.content[0].columns[0].stack.push({ text: `รายงานของวันที่: ${date}`, style: 'header' })
    this.docDefinition.content[0].columns[1].stack.push({ text: `เอกสารสร้างเมื่อ: ${now.toLocaleString()}`, style: 'header', alignment: 'right' })
    this.docDefinition.content[0].columns[1].stack.push({ text: `ผู้ลงทะเบียนทั้งหมด: ${list.length} คน`, style: 'header', alignment: 'right' })
  }


  createTableBody(listData){
    const headers = []

    for(const header of this.tableHeaders){
      headers.push({text:header.text,style:header.style})
    }

    const content =[]
    for(const [index,data] of listData.entries()){
      const rowData = []
        for(const header of this.tableHeaders){
          const cellData  = {text:'',style:header.style}
          if(header.text === 'รหัสการจอง'){
            cellData['bold'] =true
          }
          if(header.text === 'ลำดับ'){
            cellData['alignment'] = 'center'
            cellData.text =header.renderContent(index)
          }else{
            cellData.text = header.renderContent(data)
          }
          rowData.push(cellData)
        }
        content.push(rowData)
    }

    return [headers,...content]
  }
  createReportTable(listData){
    const widths = []
    for (let i = 0; i < this.tableHeaders.length; i++) {
      if(this.tableHeaders[i].text === 'เบอร์โทรศัพท์'){
        widths.push(60)
      }else if(this.tableHeaders[i].text === 'ข้อมูลเพิ่มเติม'){
        widths.push('*')
      }else {
        widths.push('auto')
      }
    }
    const table = {
      layout: tableLayout.zebraLayout,
      style: 'table',
      table: {
        headerRows: 1,
        widths,
        body: this.createTableBody(listData)
      }
    }
    this.docDefinition.content.push(table)
  }

}

module.exports = ReportPDF