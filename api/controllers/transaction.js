import Transaction from "../models/Transaction.js";
import stripe from "stripe";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

const stripeInstance = stripe(
  "sk_test_51Nc8uQB0hIhj6XwY5elpzItKLalNbWgdybN6MRV3Ykz3DwDi34AfIYCBsj35cZVFbqAP4L4cXBAT928vXiffMbzM00UZu7uye1"
);

export const createTransaction = async (req, res, next) => {
  const body = {
    source: req.body.token.id,
    //amount is in cents so need to convert to dollars
    amount: req.body.amount / 100,
    currency: "usd",
    email: req.body.token?.email,
    name: req.body.token.card?.name,
    type: "Payment Received",
    roomIds: req.body.roomIds,
    roomNumbers: req.body.roomNumbers,
    userId: req.user.id,
    hotelId: req.body.hotelId,
  };
  const stripeBody = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd",
  };
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hotel = await Hotel.findById(req.body.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const response = await stripeInstance.charges.create(stripeBody);
    body.transaction_id = response.id;
    const newTransaction = new Transaction(body);
    const savedTransaction = await newTransaction.save();
    //update the user transactions array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { transactions: savedTransaction._id },
    });
    //update the hotel transactions array
    await Hotel.findByIdAndUpdate(req.body.hotelId, {
      $push: { transactions: savedTransaction._id },
    });
    res.status(200).json(savedTransaction);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    let transactions = await Transaction.find({
      transactionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const filePath = `downloads/statements_${year}_${month}.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    //convet the month to string
    const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
      month: "long",
    });

    // add header
    doc
      .fontSize(20)
      .text(`Transacciones de ${monthName}/${year}`, 30, 30, {
        align: "center",
        underline: true,
      });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Nombre", "Tipo", "Cantidad", "Moneda", "Fecha"],
      rows: [],
    };

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const row = [
        transaction.name,
        transaction.type,
        transaction.amount,
        transaction.currency,
        date,
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();
    if (transactions.length === 0) {
      doc.fontSize(14).text("No hay transacciones.", 30, doc.y, {
        align: "left",
      });
      doc.moveDown();
    }
    //total amount of all transactions
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    //right align, number of transactions and total amount
    doc
      .fontSize(14)
      .text(`Transacciones totales: ${transactions.length}`, 350, doc.y, {
        align: "right",
      });
    doc.moveDown();
    doc.fontSize(14).text(`Ingreso total: ${total.toFixed(2)}`, 350, doc.y, {
      align: "right",
    });

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descargar aqui",
      link: `/${filePath}`,
    });
  } catch (err) {
    next(err);
  }
};
