const jwt = require("jsonwebtoken");
const { isTokenBlocked } = require("./models/User");

async function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401);
    res.send({ message: "Authorization header not found" });
    return;
  }
  if (req.headers.authorization.split(" ")[0] !== "Bearer") {
    res.status(401);
    res.send({ message: "Bearer token not found" });
    return;
  }
  if (!req.headers.authorization.split(" ")[1]) {
    res.status(401);
    res.send({ message: "Bearer token not found" });
    return;
  }

  if (await isTokenBlocked(req.headers.authorization.split(" ")[1])) {
    res.status(401);
    res.send({ message: "user logged out, please login again." });
    return;
  }

  try {
    const payload = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    req.user = payload;
    next();
  } catch (err) {
    res.status(401);
    res.send(err);
  }
}

module.exports = verifyToken;
