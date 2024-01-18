const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  if (process.env.DEV === "true") {
    next();
  } else {
    const token = req.headers["x-access-token"]?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            isLoggedIn: false,
            message: "Authentication failure",
          });
        }
        req.user = {};
        req.user.id = decoded.id;
        req.user.email = decoded.email;
        next();
      });
    } else {
      res.status(401).json({ message: "Incorrect token", isLoggedIn: false });
    }
  }
}

module.exports = verifyJWT;
