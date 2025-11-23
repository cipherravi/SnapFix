const fs = require("fs");
// const path = require("path");
// const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const { GMAIL_ID, GMAIL_PASSWORD } = require("./server-config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_ID,
    pass: GMAIL_PASSWORD,
  },
});

module.exports = transporter;
