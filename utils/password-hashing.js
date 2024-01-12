const crypto = require("crypto");

function getHashedPassword(inputPassword) {
  const salt = crypto.randomBytes(16).toString("hex");

  hash = crypto
    .pbkdf2Sync(inputPassword, salt, 10000, 512, "sha512")
    .toString("hex");

  return [hash, salt];
}

function validatePassword(inputPassword, hashedPassword, salt) {
  return (
    hashedPassword ===
    crypto.pbkdf2Sync(inputPassword, salt, 10000, 512, "sha512").toString("hex")
  );
}

module.exports = { getHashedPassword, validatePassword };
