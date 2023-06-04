var express = require("express");
const {
  getUsers,
  postUser,
  loginUser,
  logoutUser,
  getUser,
  changePassword
} = require("../controllers/User");
var router = express.Router();

/* GET users listing. */
router.get("/get-user/:id", getUser);
router.get("/", getUsers);
router.post("/", postUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.patch("/", changePassword);

module.exports = router;
