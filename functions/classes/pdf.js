const pdfPrinter = require('pdfmake/src/printer');
const fs = require('fs')
const path = require('path')


const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/default", "droidsansth.ttf"),
    bold: path.join(__dirname, "../fonts/default", "arialbd.ttf"),
    italics: path.join(__dirname, "../fonts/roboto", "Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/roboto", "Roboto-MediumItalic.ttf")
  },
  THSarabunPsk: {
    normal: path.join(__dirname, "../fonts/TH-Sarabun-PSK", "THSarabun.ttf"),
    bold: path.join(__dirname, "../fonts/TH-Sarabun-PSK", "THSarabun-Bold.ttf"),
    italics: path.join(__dirname, "../fonts/TH-Sarabun-PSK", "THSarabun-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/TH-Sarabun-PSK", "THSarabun-Bold-Italic.ttf")
  }
}

const printer = new pdfPrinter(fonts)

class PDF {
  docDefinition = {
    pageSize: 'A4',
    content: [],
    pageOrientation: "portrait",
    defaultStyle: {
      font: 'THSarabunPsk',
      fontSize: 20
    },
    pageMargins: [40, 60, 40, 60],
    styles: null
  }

  buildPdf(dir, fileName,docDefinition) {
    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition)
      pdfDoc.pipe(fs.createWriteStream(path.join(`/${dir}`, `${fileName}`))
        .on('error', (err) => { console.log('writePDF error',err) }
        ))
      pdfDoc.end()

      setTimeout(() => {
        resolve()
      }, 5000)
    })
  }
}

module.exports = PDF