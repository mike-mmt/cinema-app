const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const phone = req.body["phone"] ?? None;
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
      ...(phone !== None && { phone: phone }),
    });
    // if (phone) {
    //   newAccount.phone = phone;
    // }
    await account.save();
    res.status(201).json({ message: "success" });
  } catch (error) {
    next(error);
  }
});

function getHashedPassword(inputPassword) {
  const salt = crypto.randomBytes(16).toString("hex");

  hash = crypto
    .pbkdf2Sync(inputPassword, salt, 10000, 512, "sha512")
    .toString("hex");

  return [hash, salt];
}

module.exports = router;
