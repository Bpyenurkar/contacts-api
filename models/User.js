const sequelize = require("./dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { DataTypes } = require("sequelize");
const { Contact } = require("./Contact");

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  phone: {
    type: DataTypes.BIGINT,
    unique: true
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const BlockedToken = sequelize.define("BlockedToken", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

const getUser = async (id) => {
  const user = await User.findOne({ where: { id } });
  const contacts = await Contact.findAll({ where: { userId: id } });
  if (!user) {
    throw { message: "user not found" };
  }
  return {
    user,
    contacts
  };
};

const getUsers = async () => {
  const users = await User.findAll({});
  return users;
};

const postUser = async (user) => {
  const isUsername = await User.findOne({ where: { username: user.username } });
  if (isUsername) {
    throw { message: "username already exists" };
  }
  const isEmail = await User.findOne({ where: { email: user.email } });
  if (isEmail) {
    throw { message: "email already exists" };
  }
  const isPhone = await User.findOne({ where: { phone: user.phone } });
  if (isPhone) {
    throw { message: "phone already exists" };
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) throw err;
    bcrypt.hash(user.password, salt, async function (err, hash) {
      if (err) throw err;
      const newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        username: user.username,
        salt,
        password: hash
      });
      return await newUser.save();
    });
  });
};

const changePassword = async (body) => {
  const user = await User.findOne({ where: { id: body.id } });
  if (!user) {
    throw { message: "user not found" };
  }
  const match = await bcrypt.compare(body.oldPassword, user.password);
  if (match) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) throw err;
      bcrypt.hash(body.newPassword, salt, async function (err, hash) {
        if (err) throw err;

        await User.update(
          {
            salt,
            password: hash
          },
          { where: { id: user.id } }
        );

        return;
      });
    });
  } else {
    throw { message: "Old password is wrong" };
  }
};

const loginUser = async (body) => {
  const user = await User.findOne({
    where: {
      username: body.username
    }
  });
  if (!user) throw { message: "incorrect username" };
  try {
    const match = await bcrypt.compare(body.password, user.password);
    if (match) {
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      return { message: `logged in successfully`, token };
    } else {
      throw { message: "incorrect password" };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const logoutUser = async (token) => {
  try {
    const newBlockedToken = new BlockedToken({
      token
    });
    await newBlockedToken.save();
  } catch (err) {
    throw err;
  }
};

const isTokenBlocked = async (token) => {
  try {
    const tokens = await BlockedToken.findOne({ where: { token } });
    if (tokens) {
      return true;
    } else return false;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  User,
  getUser,
  getUsers,
  postUser,
  loginUser,
  logoutUser,
  changePassword,
  isTokenBlocked
};
