"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const svg_to_pdfkit_1 = __importDefault(require("svg-to-pdfkit"));
const axios_1 = __importDefault(require("axios"));
// ? Function to fetch svg file form url
const fetchSVG = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get(url);
        return res.data;
    }
    catch (error) {
        console.log("SVG fetching error: ", error);
    }
});
const createPDF = () => __awaiter(void 0, void 0, void 0, function* () {
    // ? create a document
    const doc = new pdfkit_1.default();
    // ? pipe the output file in ./pdf directory
    // doc.pipe(fs.createWriteStream(`./pdf/${uuid()}.pdf`));
    doc.pipe(fs_1.default.createWriteStream(`./pdf/sample.pdf`));
    // ? embed a font, set font size
    doc.fontSize(25);
    // ? render an image from external url on top-left corner with 50 margin
    const svg = yield fetchSVG("https://corexlab.s3.amazonaws.com/assets/logo.svg");
    if (svg) {
        (0, svg_to_pdfkit_1.default)(doc, svg, 50, 50);
    }
    doc.end();
});
createPDF();
