import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Transaction from "../models/Transaction.js";
import PDFDocument from "pdfkit-table";
import fs from "fs";

//This report should include the transaction# as well as the room
// reserved under that transaction and the date it was reserved
export const getAllReservations = async (req, res, next) => {
  try {
    const allReservations = await Transaction.find({}).populate("roomIds");
    const filePath = `reports/reservations.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    // add header
    doc.fontSize(20).text(`Reporte de Todas Las Reservaciones`, 30, 30, {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Transaction ID", "Name", "Amount", "Room", "Date"],
      rows: [],
    };

    allReservations.forEach((reservation) => {
      const row = [
        reservation?.transaction_id,
        reservation?.name,
        reservation?.amount,
        reservation?.roomIds.map((room) => room.title).join(", "),
        new Date(reservation?.createdAt).toLocaleString("default", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Reservaciones Totales: ${allReservations.length}`, 350, doc.y, {
        align: "right",
      });

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descarga aqui",
      link: `/${filePath}`,
    });
  } catch (error) {
    next(error);
  }
};

//This report should include the name and email of every user in the DB
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    const filePath = `reports/users.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    // add header
    doc.fontSize(20).text(`Reporte de Todos Los Usuarios`, 30, 30, {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Username", "Email", "Country", "City", "Phone"],
      rows: [],
    };

    allUsers.forEach((user) => {
      const row = [
        user?.username,
        user?.email,
        user?.country || "-",
        user?.city || "-",
        user?.phone || "-",
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();

    doc.fontSize(14).text(`Total de Usuarios: ${allUsers.length}`, 350, doc.y, {
      align: "right",
    });

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descarga aqui",
      link: `/${filePath}`,
    });
  } catch (error) {
    next(error);
  }
};

// This report should include the name, type, city, address and rooms
// of each hotel.
export const getAllHotels = async (req, res, next) => {
  try {
    const allHotels = await Hotel.find({});
    const filePath = `reports/hotels.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    // add header
    doc.fontSize(20).text(`Reporte de Todos Los Hoteles`, 30, 30, {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Name", "Type", "City", "Address", "Rooms"],
      rows: [],
    };

    allHotels.forEach((hotel) => {
      const row = [
        hotel?.name,
        hotel?.type || "-",
        hotel?.city || "-",
        hotel?.address || "-",
        hotel?.rooms?.length || "-",
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();

    doc.fontSize(14).text(`Total de Hoteles: ${allHotels.length}`, 350, doc.y, {
      align: "right",
    });

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descarga aqui",
      link: `/${filePath}`,
    });
  } catch (error) {
    next(error);
  }
};

// This report should bring me the names of the top 10 users that
// have the most reservations with the amount of reservations they have
// made
export const getTop10Users = async (req, res, next) => {
  try {
    //each user has a transaction array which is objectId of transactions, we want to count the number of transactions for each user, and sort them in descending order and get the top 10
    const top10Users = await User.aggregate([
      {
        $project: {
          username: 1,
          email: 1,
          country: 1,
          city: 1,
          phone: 1,
          numberOfReservations: {
            $size: { $ifNull: ["$transactions", []] }, // Use $ifNull to handle missing transactions
          },
        },
      },
      { $sort: { numberOfReservations: -1 } },
      { $limit: 10 },
    ]);

    const filePath = `reports/top10users.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    // add header
    doc.fontSize(20).text(`Reporte Los Mejores Usuarios`, 30, 30, {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Username", "Email", "City", "Phone", "# of Reservations"],
      rows: [],
    };

    top10Users.forEach((user) => {
      const row = [
        user?.username,
        user?.email,
        user?.city || "-",
        user?.phone || "-",
        user?.numberOfReservations || "-",
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descarga aqui",
      link: `/${filePath}`,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopHotelsReserved = async (req, res, next) => {
  try {
    const topHotels = await Hotel.aggregate([
      {
        $project: {
          name: 1,
          type: 1,
          city: 1,
          address: 1,
          numberOfReservations: {
            $size: { $ifNull: ["$transactions", []] }, // Use $ifNull to handle missing transactions
          },
        },
      },
      { $sort: { numberOfReservations: -1 } },
    ]);

    const filePath = `reports/tophotelsReserved.pdf`;

    // init document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    // save document
    doc.pipe(fs.createWriteStream(filePath));

    // add header
    doc.fontSize(20).text(`Report de Top Cabaña Reservada`, 30, 30, {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    // add table
    const table = {
      headers: ["Name", "Type", "City", "Address", "# of Reservations"],
      rows: [],
    };

    topHotels.forEach((hotel) => {
      const row = [
        hotel?.name,
        hotel?.type || "-",
        hotel?.city || "-",
        hotel?.address || "-",
        hotel?.numberOfReservations || "-",
      ];
      table.rows.push(row);
    });

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(14),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
    });

    doc.moveDown();

    doc.fontSize(14).text(`Total Hotels: ${topHotels.length}`, 350, doc.y, {
      align: "right",
    });

    // finalize the PDF and end the stream
    doc.end();

    // Respond with the file download link
    res.status(200).json({
      message: "Descarga aqui.",
      link: `/${filePath}`,
    });
  } catch (error) {
    next(error);
  }
};
