const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const user = await User.getUser(req.params.id);
    res.send(user);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.getUsers();
    res.send(users);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};
const postUser = async (req, res) => {
  try {
    await User.postUser(req.body);
    res.status(201);
    res.end();
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};

const changePassword = async (req, res) => {
  try {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    if (newPassword !== confirmPassword) {
      throw { message: "new and old password doesn't match" };
    }
    await User.changePassword({
      id: req.body.id,
      oldPassword,
      newPassword
    });
    res.status(200);
    res.send({ message: "password changed successfully" });
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await User.loginUser(req.body);
    res.send(result);
  } catch (err) {
    res.status(401);
    res.send(err);
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.logoutUser(req.headers.authorization.split(" ")[1]);
    res.send({ message: "user logged out" });
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};

module.exports = {
  getUser,
  getUsers,
  postUser,
  loginUser,
  logoutUser,
  changePassword
};
