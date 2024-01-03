const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
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
    const validation = validatePassword(
      password,
      account.passwordHash,
      account.passwordSalt
    );
    // to do: json web token
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
