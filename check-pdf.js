const pdfParseModule = require("pdf-parse");

console.log("Type of pdfParseModule:", typeof pdfParseModule);
console.log("Keys in pdfParseModule:", Object.keys(pdfParseModule));

if (typeof pdfParseModule === "object") {
    console.log("default type:", typeof pdfParseModule.default);
    console.log("pdfParse type:", typeof pdfParseModule.pdfParse);
    console.log("Parse type:", typeof pdfParseModule.Parse);
    console.log("parse type:", typeof pdfParseModule.parse);
}
