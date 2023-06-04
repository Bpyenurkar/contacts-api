const sequelize = require("./dbConnection");

const { DataTypes } = require("sequelize");

const Contact = sequelize.define("Contact", {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactNo: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  zipCode: {
    type: DataTypes.INTEGER
  }
});

const getContacts = async (userId) => {
  try {
    const contacts = await Contact.findAll({ where: { userId } });
    return contacts;
  } catch (err) {
    throw err;
  }
};

const postContact = async (contact) => {
  try {
    const newContact = new Contact(contact);
    await newContact.save();
    return;
  } catch (err) {
    throw err;
  }
};

const putContact = async (contact) => {
  try {
    await Contact.update(contact, { where: { id: contact.id } });
    return;
  } catch (err) {
    throw err;
  }
};

const deleteContact = async (id) => {
  try {
    const deleted = await Contact.destroy({ where: { id } });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  Contact,
  getContacts,
  postContact,
  putContact,
  deleteContact
};
