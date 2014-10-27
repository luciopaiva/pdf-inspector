"use strict";

var
    Pdf = require('./pdf'),
    PdfParser = require('./parser');

exports = module.exports = openPdf;

/**
 * Factory function to create new PDF objects
 *
 * @param filename
 * @returns {object}
 */
function openPdf(filename) {
    var
        pdf,
        buffer = require('fs').readFileSync(filename),
        xRefInfo,
        parser = new PdfParser(buffer);

    pdf = new Pdf(filename);
    pdf.version = parser.getVersion();
    xRefInfo = parser.findXRef();
    pdf.startXRefPosition = xRefInfo.startXRefPos;
    pdf.xrefPosition = xRefInfo.xRefPos;
    xRefInfo = parser.readXRef(pdf.xrefPosition);
    pdf.trailerPosition = xRefInfo.trailerPosition;
    pdf.xref = xRefInfo.sections;
    pdf.trailer = parser.getTrailer(pdf.trailerPosition);

    pdf.root = getRootNode(pdf);

    return {
        get filename() {
            return pdf.filename;
        },
        get version() {
            return pdf.version;
        }
    };
}

function getRootNode(pdf) {
    var
        root = pdf.trailer.Root;

    return root;
}
