const  PDF = require('./pdf') 
const {ReportPdfStyle} = require('./pdf.styles') 
const { reportTableHeader} = require('./render')

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
  tableHeaders = reportTableHeader

  constructor(){
    super()
  }

  main(entityName, summaryData, fileName,type){
    this.setPageStyle()
    this.createReportHeader(entityName,summaryData)
    
    if(type != '100' && type!== '200'){
      this.tableHeaders = this.tableHeaders.filter(header => header.text!== 'กลุ่ม')
    }

    if(summaryData.list.length>0){
      this.createReportTable(summaryData.list)
    }
    this.docDefinition.content.push({ text: `ผู้ลงทะเบียนทั้งหมด: ${summaryData.list.length} คน`, style: 'tableContentStyle', margin: [0, 10, 0, 0] })
    return this.buildPdf(fileName,this.docDefinition)
  }

  setPageStyle(){
    this.docDefinition.styles = ReportPdfStyle
    this.docDefinition.pageOrientation = 'landscape'
    this.docDefinition.pageMargins = [40, 30, 40, 30]
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
      }else if(this.tableHeaders[i].text === 'อายุ'){
        widths.push(30)
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