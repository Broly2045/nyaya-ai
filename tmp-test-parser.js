const PDFParser = require("pdf2json");

async function test() {
  console.log("Downloading PDF...");
  const response = await fetch("https://res.cloudinary.com/dtdznj5p5/raw/upload/v1774597842/nyayaai/documents/69c633021d407240226b7100/1774597800804-LEGAL_NOTICE.pdf");
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log("Parsing PDF...");
  const pdfParser = new PDFParser(null, 1);
  
  try {
    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });
    console.log("Success! Extracted characters:", text.length);
    console.log("Snippet:", text.substring(0, 150).replace(/\r?\n|\r/g, " "));
  } catch (err) {
    console.error("Failed!", err);
  }
}

test();
