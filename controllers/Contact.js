const Contact = require("../models/Contact");

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.getContacts(req.user.id);
    res.send(contacts);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send(err);
  }
};
const postContact = async (req, res) => {
  req.body.userId = req.user.id;
  try {
    const newContact = await Contact.postContact(req.body);
    res.status(201);
    res.send({ message: "Contact saved successfully" });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
};

const putContact = async (req, res) => {
  try {
    await Contact.putContact(req.body);
    res.status(200);
    res.send({ message: "Contact saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send(error);
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.deleteContact(req.query.id);
    res.status(200);
    res.send({ message: "Contact Deleted Successfully" });
  } catch (error) {
    res.status(400);
    res.send(error);
  }
};

module.exports = {
  getContacts,
  postContact,
  putContact,
  deleteContact
};
