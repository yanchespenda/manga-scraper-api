"use strict";

var fs = require('fs');

var fontContainer = {
  vfs: {
    'data/Symbol.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/Symbol.afm', 'utf8'),
      encoding: 'utf8'
    }
  },
  fonts: {
    Symbol: {
      normal: 'Symbol'
    }
  }
};

if (typeof (void 0).pdfMake !== 'undefined' && typeof (void 0).pdfMake.addFontContainer !== 'undefined') {
  (void 0).pdfMake.addFontContainer(fontContainer);
}

if (typeof module !== 'undefined') {
  module.exports = fontContainer;
}