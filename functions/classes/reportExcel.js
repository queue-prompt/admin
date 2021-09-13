const ExcelJs = require("exceljs");
const {reportTableHeader} = require('./render')
class ReportExcel {
  workbook = new ExcelJs.Workbook();
  tableHeaders = reportTableHeader

  constructor(worksheetName, entityName, summaryData, type) {
    this.main(worksheetName, entityName, summaryData, type);
  }

  async main(worksheetName, entityName, summaryData, type) {
    const { date, list } = summaryData;
    const sheetId = this.addWorksheet(worksheetName);
    this.genReportHeader(sheetId, date, entityName, list);

    if (type != '100' && type!== '200') {
      this.tableHeaders = this.tableHeaders.filter(header => header.text !== 'กลุ่ม')
    }

    if (list.length > 0) {
      this.genReportContent(sheetId, date, list);
    }
    this.adjustStyle(sheetId);
  }

  addWorksheet(worksheetName) {
    const { id } = this.workbook.addWorksheet(worksheetName, {
      pageSetup: { paperSize: 9 }
    });
    return id;
  }

  genReportHeader(sheetId, dataDate, entityName, list) {
    const now = new Date();
    const headerRows = [
      [`หน่วยงาน: ${entityName}`],
      [`รายงานของวันที่: ${dataDate}`],
      [`เอกสารสร้างเมื่อ: ${now.toLocaleString()}`],
      [`ผู้ลงทะเบียนทั้งหมด: ${list.length} คน`],
      [""]
    ];
    this.workbook.getWorksheet(sheetId).addRows(headerRows);
  }

  genReportContent(sheetId, reportDate, dataList) {
    let contentHeader = []
    for(const header of this.tableHeaders){
      contentHeader.push(header.text)
    }
    this.workbook.getWorksheet(sheetId).addRow(contentHeader);
    for (const [index, data] of dataList.entries()) {
      const rowData = [];

      for(const header of this.tableHeaders){
        if(header.text === 'ลำดับ'){
          rowData.push(header.renderContent(index))
        }else if(header.text === 'ช่วงเวลาการจอง'){
          const convertedDateRange = header.renderContent(data) 
          rowData.push(`${convertedDateRange}    ${reportDate}`)
        }else{
          rowData.push(header.renderContent(data))
        }
      }

      this.workbook.getWorksheet(sheetId).addRow(rowData);
    }
  }

  adjustStyle(sheetId) {
    this.workbook.getWorksheet(sheetId).eachRow((row, rowNumber) => {
      if (rowNumber < 6) {
        row.height = 30;
        row.eachCell(cell => {
          cell.style = {
            font: { size: 16 }
          };
        });
      }
      if (rowNumber >= 6) {
        row.height = 30;
        row.alignment = { vertical: "middle" };
        row.eachCell(cell => {
          cell.style.font = 13;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
        });
        if (rowNumber % 2 !== 0 && rowNumber > 6) {
          row.eachCell(cell => {
            cell.style.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "d3d3d3" }
            };
          });
        }
      }
    });

    for(const [index,header] of this.tableHeaders.entries()){
      const columnNumber  = index+1
      switch(header.text){
        case 'ลำดับ':
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 5
          break;
        case 'ช่วงเวลาการจอง':
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 31
          break;
        case 'รหัสบัตรประชาชน' :
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 20
          break;
        case 'ชื่อ-นามสกุล':
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 34
          break;
        case 'เบอร์โทรศัพท์':
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 20
          break;
        case 'ข้อมูลเพิ่มเติม':
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 40
          break;
        default:
          this.workbook.getWorksheet(sheetId).getColumn(columnNumber).width = 15
      }      
    }
    this.workbook.getWorksheet(sheetId).views = [
      { state: "frozen", xSplit: this.tableHeaders.length, ySplit: 6 }
    ];
  }

  writeBuffer() {
    return new Promise(async (resolve, reject) => {
      try {
        const buffer = await this.workbook.xlsx.writeBuffer();
        resolve(buffer);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ReportExcel;
