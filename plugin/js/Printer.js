"use strict";

exports.__esModule = true;
exports.default = void 0;

var _PDFDocument = _interopRequireDefault(require("./PDFDocument"));

var _LayoutBuilder = _interopRequireDefault(require("./LayoutBuilder"));

var _SVGMeasure = _interopRequireDefault(require("./SVGMeasure"));

var _standardPageSizes = _interopRequireDefault(require("./standardPageSizes"));

var _tableLayouts = require("./tableLayouts");

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _variableType = require("./helpers/variableType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Printer which turns document definition into a pdf
 *
 * @example
 * var fontDescriptors = {
 *	Roboto: {
 *		normal: 'fonts/Roboto-Regular.ttf',
 *		bold: 'fonts/Roboto-Medium.ttf',
 *		italics: 'fonts/Roboto-Italic.ttf',
 *		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
 *	}
 * };
 *
 * var printer = new PdfPrinter(fontDescriptors);
 */
class PdfPrinter {
  /**
   * @param {object} fontDescriptors font definition dictionary
   * @param {object} virtualfs
   * @param {object} urlResolver
   */
  constructor(fontDescriptors, virtualfs = null, urlResolver = null) {
    this.fontDescriptors = fontDescriptors;
    this.virtualfs = virtualfs;
    this.urlResolver = urlResolver;
  }
  /**
   * Executes layout engine for the specified document and renders it into a pdfkit document
   * ready to be saved.
   *
   * @param {object} docDefinition
   * @param {object} options
   * @returns {Promise<PDFDocument>} resolved promise return a pdfkit document
   */


  createPdfKitDocument(docDefinition, options = {}) {
    return new Promise((resolve, reject) => {
      this.resolveUrls(docDefinition).then(() => {
        try {
          docDefinition.version = docDefinition.version || '1.3';
          docDefinition.compress = (0, _variableType.isBoolean)(docDefinition.compress) ? docDefinition.compress : true;
          docDefinition.images = docDefinition.images || {};
          docDefinition.pageMargins = (0, _variableType.isValue)(docDefinition.pageMargins) ? docDefinition.pageMargins : 40;
          let pageSize = fixPageSize(docDefinition.pageSize, docDefinition.pageOrientation);
          let pdfOptions = {
            size: [pageSize.width, pageSize.height],
            pdfVersion: docDefinition.version,
            compress: docDefinition.compress,
            userPassword: docDefinition.userPassword,
            ownerPassword: docDefinition.ownerPassword,
            permissions: docDefinition.permissions,
            fontLayoutCache: (0, _variableType.isBoolean)(options.fontLayoutCache) ? options.fontLayoutCache : true,
            bufferPages: options.bufferPages || false,
            autoFirstPage: false,
            font: null
          };
          this.pdfKitDoc = new _PDFDocument.default(this.fontDescriptors, docDefinition.images, pdfOptions, this.virtualfs);
          setMetadata(docDefinition, this.pdfKitDoc);
          const builder = new _LayoutBuilder.default(pageSize, fixPageMargins(docDefinition.pageMargins), new _SVGMeasure.default());
          builder.registerTableLayouts(_tableLayouts.tableLayouts);

          if (options.tableLayouts) {
            builder.registerTableLayouts(options.tableLayouts);
          }

          let pages = builder.layoutDocument(docDefinition.content, this.pdfKitDoc, docDefinition.styles || {}, docDefinition.defaultStyle || {
            fontSize: 12,
            font: 'Roboto'
          }, docDefinition.background, docDefinition.header, docDefinition.footer, docDefinition.watermark, docDefinition.pageBreakBefore);
          let maxNumberPages = docDefinition.maxPagesNumber || -1;

          if ((0, _variableType.isNumber)(maxNumberPages) && maxNumberPages > -1) {
            pages = pages.slice(0, maxNumberPages);
          } // if pageSize.height is set to Infinity, calculate the actual height of the page that
          // was laid out using the height of each of the items in the page.


          if (pageSize.height === Infinity) {
            let pageHeight = calculatePageHeight(pages, docDefinition.pageMargins);
            this.pdfKitDoc.options.size = [pageSize.width, pageHeight];
          }

          const renderer = new _Renderer.default(this.pdfKitDoc, options.progressCallback);
          renderer.renderPages(pages);
          resolve(this.pdfKitDoc);
        } catch (e) {
          reject(e);
        }
      }, result => {
        reject(result);
      });
    });
  }
  /**
   * @param {object} docDefinition
   * @returns {Promise}
   */


  resolveUrls(docDefinition) {
    return new Promise((resolve, reject) => {
      if (this.urlResolver === null) {
        resolve();
      }

      for (let font in this.fontDescriptors) {
        if (this.fontDescriptors.hasOwnProperty(font)) {
          if (this.fontDescriptors[font].normal) {
            this.urlResolver.resolve(this.fontDescriptors[font].normal);
          }

          if (this.fontDescriptors[font].bold) {
            this.urlResolver.resolve(this.fontDescriptors[font].bold);
          }

          if (this.fontDescriptors[font].italics) {
            this.urlResolver.resolve(this.fontDescriptors[font].italics);
          }

          if (this.fontDescriptors[font].bolditalics) {
            this.urlResolver.resolve(this.fontDescriptors[font].bolditalics);
          }
        }
      }

      if (docDefinition.images) {
        for (let image in docDefinition.images) {
          if (docDefinition.images.hasOwnProperty(image)) {
            this.urlResolver.resolve(docDefinition.images[image]);
          }
        }
      }

      this.urlResolver.resolved().then(() => {
        resolve();
      }, result => {
        reject(result);
      });
    });
  }

}

function setMetadata(docDefinition, pdfKitDoc) {
  // PDF standard has these properties reserved: Title, Author, Subject, Keywords,
  // Creator, Producer, CreationDate, ModDate, Trapped.
  // To keep the pdfmake api consistent, the info field are defined lowercase.
  // Custom properties don't contain a space.
  function standardizePropertyKey(key) {
    let standardProperties = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate', 'Trapped'];
    let standardizedKey = key.charAt(0).toUpperCase() + key.slice(1);

    if (standardProperties.includes(standardizedKey)) {
      return standardizedKey;
    }

    return key.replace(/\s+/g, '');
  }

  pdfKitDoc.info.Producer = 'pdfmake';
  pdfKitDoc.info.Creator = 'pdfmake';

  if (docDefinition.info) {
    for (let key in docDefinition.info) {
      let value = docDefinition.info[key];

      if (value) {
        key = standardizePropertyKey(key);
        pdfKitDoc.info[key] = value;
      }
    }
  }
}

function calculatePageHeight(pages, margins) {
  function getItemHeight(item) {
    if ((0, _variableType.isFunction)(item.item.getHeight)) {
      return item.item.getHeight();
    } else if (item.item._height) {
      return item.item._height;
    } else {
      // TODO: add support for next item types
      return 0;
    }
  }

  function getBottomPosition(item) {
    let top = item.item.y;
    let height = getItemHeight(item);
    return top + height;
  }

  let fixedMargins = fixPageMargins(margins || 40);
  let height = fixedMargins.top;
  pages.forEach(page => {
    page.items.forEach(item => {
      let bottomPosition = getBottomPosition(item);

      if (bottomPosition > height) {
        height = bottomPosition;
      }
    });
  });
  height += fixedMargins.bottom;
  return height;
}

function fixPageSize(pageSize, pageOrientation) {
  function isNeedSwapPageSizes(pageOrientation) {
    if ((0, _variableType.isString)(pageOrientation)) {
      pageOrientation = pageOrientation.toLowerCase();
      return pageOrientation === 'portrait' && size.width > size.height || pageOrientation === 'landscape' && size.width < size.height;
    }

    return false;
  } // if pageSize.height is set to auto, set the height to infinity so there are no page breaks.


  if (pageSize && pageSize.height === 'auto') {
    pageSize.height = Infinity;
  }

  let size = pageSize2widthAndHeight(pageSize || 'A4');

  if (isNeedSwapPageSizes(pageOrientation)) {
    // swap page sizes
    size = {
      width: size.height,
      height: size.width
    };
  }

  size.orientation = size.width > size.height ? 'landscape' : 'portrait';
  return size;
}

function fixPageMargins(margin) {
  if ((0, _variableType.isNumber)(margin)) {
    margin = {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin
    };
  } else if ((0, _variableType.isArray)(margin)) {
    if (margin.length === 2) {
      margin = {
        left: margin[0],
        top: margin[1],
        right: margin[0],
        bottom: margin[1]
      };
    } else if (margin.length === 4) {
      margin = {
        left: margin[0],
        top: margin[1],
        right: margin[2],
        bottom: margin[3]
      };
    } else {
      throw new Error('Invalid pageMargins definition');
    }
  }

  return margin;
}

function pageSize2widthAndHeight(pageSize) {
  if ((0, _variableType.isString)(pageSize)) {
    let size = _standardPageSizes.default[pageSize.toUpperCase()];

    if (!size) {
      throw new Error(`Page size ${pageSize} not recognized`);
    }

    return {
      width: size[0],
      height: size[1]
    };
  }

  return pageSize;
}

var _default = PdfPrinter;
exports.default = _default;