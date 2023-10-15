import fs from "fs";
import dayjs from "dayjs";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

const fetchSVG = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.text();

    return data;
  } catch (error) {
    console.log("SVG fetching error: ", error);
  }
};

const createPDF = async () => {
  const doc = new PDFDocument();

  let yAxis = 50;

  doc.pipe(fs.createWriteStream(`./pdf/sample.pdf`));

  const svg = await fetchSVG(
    "https://corexlab.s3.amazonaws.com/assets/logo.svg"
  );

  if (svg) {
    SVGtoPDF(doc, svg, 50, yAxis);
  }

  doc
    .fontSize(20)
    .text(dayjs().format("DD/MM/YYYY"), 420, yAxis + 5, { align: "right" });

  // company info and address
  doc.fontSize(10).text("Corexlab Pty Ltd.", 50, yAxis + 60);
  doc
    .fontSize(10)
    .text("Unit3, 29 Rosemont Street, Punchbowl, NSW", 50, yAxis + 72);
  doc.fontSize(10).text("+61492840593, razuahammed@icloud.com", 50, yAxis + 84);

  // customer info and address
  doc
    .fontSize(10)
    .fillColor("gray")
    .text("Bill To:", 50, yAxis + 114)
    .fillColor("black");
  doc.fontSize(10).text("Oasiscode", 50, yAxis + 126);
  doc
    .fontSize(10)
    .text("308 Palmerston Ave Suite 219 Toronto, ON", 50, yAxis + 138, {
      width: 200,
    });
  doc.fontSize(10).text("M6J 3X9", 50, yAxis + 150);
  doc.fontSize(10).text("shayan@oasiscode.com", 50, 212);

  doc.fontSize(10).text("Date:", 416, yAxis + 102);
  doc
    .fontSize(10)
    .text(dayjs().format("DD/MM/YYYY"), 480, yAxis + 102, { align: "right" });
  doc
    .roundedRect(
      doc.page.width * 0.5,
      yAxis + 118,
      doc.page.width * 0.5 - 50,
      23,
      4
    )
    .opacity(0.1)
    .fill("gray")
    .fillOpacity(1)
    .fillColor("black");

  doc.fontSize(10).text("Balance Due:", 380, yAxis + 126);
  doc.fontSize(10).text("$124.00", 480, yAxis + 126, { align: "right" });

  // invoice items
  doc
    .roundedRect(50, yAxis + 186, doc.page.width - 100, 23, 4)
    .fill("#3b3b3b")
    .fillColor("white")
    .fillOpacity(1);

  doc.fontSize(10).text("Item", 60, 244);
  doc.fontSize(10).text("Quantity", 320, 244);
  doc.fontSize(10).text("Rate", 420, 244);
  doc.fontSize(10).text("Amount", 500, 244).fillColor("black");

  const items = [
    {
      id: 1,
      item: "Software Development",
      quantity: 1,
      rate: 124,
      amount: "$124.00",
    },
    {
      id: 2,
      item: "App Development",
      quantity: 1,
      rate: 124,
      amount: "$124.00",
    },
    {
      id: 3,
      item: "Web Development",
      quantity: 2,
      rate: 124,
      amount: "$124.00",
    },
  ];

  // loop through items and generate pdf
  let y = yAxis + 220;

  for (let i = 0; i < items.length; i++) {
    doc.fontSize(10).text(items[i].item, 60, y);
    doc.fontSize(10).text(items[i].quantity.toString(), 320, y);
    doc.fontSize(10).text(`$${items[i].rate}.00`, 420, y);
    doc.fontSize(10).text(`$${items[i].rate * items[i].quantity}.00`, 500, y);

    y += 20;
  }

  // line
  let lineStart = y + 30;
  doc
    .opacity(1)
    .lineWidth(0.5)
    .lineCap("square")
    .fill("black")
    .moveTo(50, lineStart)
    .lineTo(doc.page.width - 50, lineStart)
    .stroke("black");

  doc.text("Sub Total:", doc.page.width * 0.67, lineStart + 30);
  doc.text("$124.00", doc.page.width * 0.8, lineStart + 30);
  doc
    .lineWidth(0.5)
    .lineCap("square")
    .fill("black")
    .moveTo(doc.page.width * 0.57, lineStart + 50)
    .lineTo(doc.page.width - 50, lineStart + 50)
    .stroke("black");

  doc.text("Total:", doc.page.width * 0.67, lineStart + 60);
  doc.text("$524.00", doc.page.width * 0.8, lineStart + 60);

  doc
    .fontSize(10)
    .fillColor("gray")
    .text("Note:", 50, lineStart + 100)
    .fillColor("black");
  doc
    .fontSize(10)
    .text("Billing Period: Jan 1 - Feb 1, 2023", 50, lineStart + 120);

  doc.end();
  console.log("Generating PDF");
};

createPDF();
