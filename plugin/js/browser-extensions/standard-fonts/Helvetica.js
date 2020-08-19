"use strict";

var fs = require('fs');

var fontContainer = {
  vfs: {
    'data/Helvetica.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/Helvetica.afm', 'utf8'),
      encoding: 'utf8'
    },
    'data/Helvetica-Bold.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/Helvetica-Bold.afm', 'utf8'),
      encoding: 'utf8'
    },
    'data/Helvetica-Oblique.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/Helvetica-Oblique.afm', 'utf8'),
      encoding: 'utf8'
    },
    'data/Helvetica-BoldOblique.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/Helvetica-BoldOblique.afm', 'utf8'),
      encoding: 'utf8'
    }
  },
  fonts: {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  }
};

if (typeof (void 0).pdfMake !== 'undefined' && typeof (void 0).pdfMake.addFontContainer !== 'undefined') {
  (void 0).pdfMake.addFontContainer(fontContainer);
}

if (typeof module !== 'undefined') {
  module.exports = fontContainer;
}