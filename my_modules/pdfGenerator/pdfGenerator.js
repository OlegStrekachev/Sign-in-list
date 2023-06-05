"use strict";

const fonts = {
  Roboto: {
    normal: "my_modules/pdfGenerator/fonts/Roboto-Italic.ttf",
    bold: "my_modules/pdfGenerator/fonts/Roboto-Medium.ttf",
    italics: "my_modules/pdfGenerator/fonts/Roboto-MediumItalic.ttf",
    bolditalics: "my_modules/pdfGenerator/fonts/Roboto-Regular.ttf",
  },
};

const PdfPrinter = require("pdfmake");
const printer = new PdfPrinter(fonts);
const fs = require("fs");
let contentController = require("./pdfContent");

async function generatePDF() {
  try {
    let docDefinition = await contentController.generateDocumentDefinition();
    const options = {
      //..
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream("document.pdf"));
    pdfDoc.end();

    fs.watch(
      "my_modules/pdfGenerator/pdfContent.js",
      async (eventType, filename) => {
        if (eventType === "change") {
          console.log("File content changed");
          delete require.cache[require.resolve("./pdfContent")];
          contentController = require("./pdfContent");
          docDefinition = await contentController.generateDocumentDefinition();

          const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
          pdfDoc.pipe(fs.createWriteStream("document.pdf"));
          pdfDoc.end();
        }
      }
    );
  } catch (err) {
    console.log("Error: ", err);
  }
}

// Call the function to generate the PDF
module.exports = generatePDF;