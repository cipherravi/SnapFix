const express = require("express");
const router = express.Router();
const v1Routes = require("./v1");
const { GMAIL_ID: from } = require("../config/server-config");
const { mailConfig } = require("../config");
const welcome = require("../utils/templates/welcome");

router.use("/v1", v1Routes);

router.use("/test-mail", async (req, res) => {
  try {
    const { header, to, subject, text, username } = req.body;
    // Email options
    let mailOptions = {
      from: `${header} ${from}`,
      to: `${to}`,
      subject: `Welcome to SnapFix 🎉 Your journey begins!`,
      //   text: `${text}`,
      html: `${welcome(username)}`,
    };

    //Send Mail
    await mailConfig.sendMail(mailOptions);

    return res.status(200).json({ message: "Successfully send mail" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
