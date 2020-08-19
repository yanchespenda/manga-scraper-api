"use strict";

var fs = require('fs');

var fontContainer = {
  vfs: {
    'data/ZapfDingbats.afm': {
      data: fs.readFileSync(__dirname + '/../../../node_modules/pdfkit/js/data/ZapfDingbats.afm', 'utf8'),
      encoding: 'utf8'
    }
  },
  fonts: {
    ZapfDingbats: {
      normal: 'ZapfDingbats'
    }
  }
};

if (typeof (void 0).pdfMake !== 'undefined' && typeof (void 0).pdfMake.addFontContainer !== 'undefined') {
  (void 0).pdfMake.addFontContainer(fontContainer);
}

if (typeof module !== 'undefined') {
  module.exports = fontContainer;
}