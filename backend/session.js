const session = require("express-session");
const Sequelize = require("sequelize");
const dbKeys =
  process.env.NODE_ENV === "production"
    ? require("./env/key").postgresql_prod
    : require("./env/key").postgresql_dev;
const connectionStr = `postgres://${dbKeys.username}:${dbKeys.password}@${dbKeys.host}:${dbKeys.port}/${dbKeys.database}`;

module.exports = function() {
  const sequelize = new Sequelize(connectionStr);
  const SequelizeStore = require("connect-session-sequelize")(session.Store);
  const myStore = new SequelizeStore({
    db: sequelize
  });
  return myStore;
};
