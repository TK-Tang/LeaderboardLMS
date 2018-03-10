"use strict";

const path = require("path");
const Sequelize = require("sequelize");
const fs = require("fs");

const sequelizeCredentials = new Sequelize("DocereLMS", "postgres", "24157817", {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});

const db = {};

fs.readdirSync(__dirname).filter(function(file){
    return (file.indexOf(".") !== 0) && (file !== "index.js")
}).forEach (function (file){
    const model = sequelizeCredentials.import(path.join(__dirname, file));
    db[model.name] = model;
});

db.sequelizeCredentials = sequelizeCredentials;
db.Sequelize = Sequelize;
db.Users = require("./users")(sequelizeCredentials, Sequelize);
db.Roles = require("./roles")(sequelizeCredentials, Sequelize);
db.Courses = require("./courses")(sequelizeCredentials, Sequelize);

db.Users.hasOne(db.Roles, {foreignKey: "user_id"});
db.Courses.hasOne(db.Roles, {foreignKey: "course_id"});
db.Courses.belongsToMany(db.Users, { through: "Roles" });
db.Users.belongsToMany(db.Courses, { through: "Roles" });

module.exports = db;