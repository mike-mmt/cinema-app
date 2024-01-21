const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Account = require("../models/Account");
const { validatePassword } = require("../utils/password-hashing");

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne()
      .where("email")
      .equals(email)
      .select("passwordHash passwordSalt isAdmin _id email")
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
        id: account._id.toString(),
        email,
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        (err, token) => {
          if (err) return res.status(500).json({ message: err });
          return res.status(200).json({
            message: "success",
            isAdmin: account.isAdmin || false,
            token: "Bearer " + token,
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    // next(error);
  }
});

module.exports = router;
