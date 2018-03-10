const Express = require("express");
const BodyParser = require("body-parser");
const BCrypt = require("bcrypt-nodejs");
const Passport = require("passport");
const Session = require("express-session")

const App = Express();


const startScript = require("./scripts/master-startscript.js");

const Models = require("./models");
const AuthenticationService = require("./middleware/authentication-service.js");

App.use(Session({ secret: "secret_seed", resave: true, saveUninitialized: false, secure: false, rolling: true }));
App.use(Passport.initialize());
App.use(Passport.session());
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
App.use(AuthenticationService.isStudent);

require("./routes/authentication-router.js")(App, Passport);
require('./passport/passport.js')(Passport, Models.Users);

Models.sequelizeCredentials.sync({ force: true }).then(() => {
    startScript.startScript();

    App.listen(11000, () => {
        console.log("Docere LMS API active on port 11000!");
    });
}).catch(e => {
    console.error(e);
});
