const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const Account = require("../models/Account");

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne()
      .where("email")
      .equals(email)
      .select("passwordHash passwordSalt")
      .exec();
    if (account === null) {
      return res.status(404).json({ error: "account does not exist" });
    }
    const validLogin = validatePassword(
      password,
      account.passwordHash,
      account.passwordSalt
    );

    if (validLogin) {
      const payload = {
        id: account._id,
        email,
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 86400 },
        (err, token) => {
          if (err) return res.status(200).json({ message: err });
          return res.json({
            message: "success",
            token: "Bearer " + token,
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    next(error);
  }
});

function validatePassword(inputPassword, hashedPassword, salt) {
  return (
    hashedPassword ===
    crypto.pbkdf2Sync(inputPassword, salt, 10000, 512, "sha512").toString("hex")
  );
}

module.exports = router;
