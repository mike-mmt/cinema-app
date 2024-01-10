const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Account = require("../models/Account");
const { validateRegisterData } = require("../utils/form-validations");
const { getHashedPassword } = require("../utils/password-hashing");

router.post("/", async (req, res, next) => {
  try {
    const validation = validateRegisterData(req.body);
    if (!validation) {
      return res.status(400).json({ error: "invalid form data" });
    }
    const { email, firstName, lastName, password } = req.body;
    email = email.toLowerCase();

    const [hashedPassword, salt] = getHashedPassword(password);
    const existingAccount = await Account.findOne()
      .where("email")
      .equals(email)
      .exec();
    if (existingAccount !== null) {
      return res
        .status(400)
        .json({ error: "account with this email already exists" });
    }

    const account = new Account({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      passwordSalt: salt,
      orders: [],
      isAdmin: false,
      ...(req.body["phone"] && { phone: req.body["phone"] }),
    });

    await account.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
