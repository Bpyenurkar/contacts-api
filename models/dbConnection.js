const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("Error in Database Connection", error);
  });

module.exports = sequelize;
