var express = require("express");
const {
  getContacts,
  postContact,
  putContact,
  deleteContact
} = require("../controllers/Contact");
var router = express.Router();

/* GET users listing. */
router.get("/", getContacts);
router.post("/", postContact);
router.put("/", putContact);
router.delete("/", deleteContact);

module.exports = router;
