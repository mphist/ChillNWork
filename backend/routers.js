const pgp = require("pg-promise")(/*options*/);
const dbKeys = require("./env/key").postgresql;
const connectionStr = `postgres://${dbKeys.username}:${dbKeys.password}@${dbKeys.host}:${dbKeys.port}/${dbKeys.database}`;
const db = pgp(connectionStr);
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const passport = require("./passport")();

module.exports = {
  registerRouter: function registerRouter(req, res, next) {
    const { email, password } = req.body;

    db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]).then(function(
      user
    ) {
      // if email is exists in db, notify user the email already exists
      if (user) {
        res.send("Email you entered is in use");
      } else {
        const id = shortid.generate();

        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
              console.log("Error in hashing the password", err);
            }
            // Store hash in your password DB.
            const pw = hash;
            db.one(
              `INSERT INTO users (id, email, password) VALUES 
                  ($1, $2, $3) RETURNING id, email, password`,
              [id, email, pw]
            )
              .then(function(user) {
                console.log("DATA created:", user);

                // register successful...login the user
                req.logIn(user, function(err) {
                  if (err) {
                    console.log("login error");
                    return next(err);
                  }
                  console.log("login successful!!");
                  req.session.is_loggedin = true;
                  console.log("---SESSION data----", req.session);
                  //res.status(200).send("registration successful");
                  res.redirect("http://localhost:3000");
                });
              })
              .catch(function(error) {
                console.log("ERROR:", error);
              });
          });
        });
      }
    });
  },
  authRouter: function authRouter(req, res, next) {
    console.log("connected to /auth");
    passport.authenticate("local", function(err, user, info) {
      console.log(" user in /auth", user);
      if (err) {
        console.log("error");
        return next(err);
      }
      if (!user) {
        console.log("user does not exist or password entered is wrong!!");
        /*   res
              .status(401)
              .send("user does not exist or password entered is wrong!!"); */
      }
      req.logIn(user, function(err) {
        if (err) {
          console.log("login error");
          return next(err);
        }
        console.log("login successful!!");
        req.session.is_loggedin = true;
        console.log("---SESSION data----", req.session);
        //res.status(200).send("login successful :)");
        res.redirect("http://localhost:3000");
      });
    })(req, res, next);
  },
  authCheckRouter: function authCheckRouter(req, res, next) {
    const { email, password } = req.body;
    console.log("data passed to /auth/check", email, password);

    db.oneOrNone("SELECT email, password FROM users WHERE email = $1", [email])
      .then(data => {
        if (data) {
          console.log("retrieved data ", data);
          if (bcrypt.compareSync(password, data.password)) {
            console.log("user email and password matched");
            res.end();
          } else {
            console.log("password entered is incorrect");
            res.status(401).send("Incorrect password");
          }
        } else {
          console.log("email doesn't exist in DB");
          res.status(401).send("Email doesn't exist");
        }
      })
      .catch(err => console.log(err));
  },
  authValidateAuthRouter: function authValidateAuthRouter(req, res, next) {
    console.log("PRINTING REQ.SESSION", req.session);
    console.log("PRINTING REQ.USER", req.user);

    if (req.user) {
      if (req.user.googleid !== null || req.user.facebookid !== null) {
        req.session.is_loggedin = true;
        console.log("User is logged in via Google or Facebook", req.session);
        res.status(200).send(req.session);
      } else {
        res.status(200).send("Validation failed");
      }
    } else {
      console.log("User is not logged in");
      res.status(200).send("User is not logged in");
    }
  },
  authLogoutRouter: function authLogoutRouter(req, res, next) {
    /*   console.log("SESSION BEFORE logout", req.session);
         console.log("REQ.USER BEFORE logout", req.user); */
    req.session.is_loggedin = false;
    req.logout();
    /*   console.log("SESSION AFTER logout()", req.session);
         console.log("REQ.USER AFTER logout", req.user); */

    req.session.destroy(function(err) {
      /*  console.log("SESSION DESTROYED!@!!!");
           console.log("SESSION AFTER DESTROY", req.session);
           console.log("PRINT ANY ERROR", err);
           console.log("After logout", req.user); */
      res.send("Session is destroyed");
    });
  }
};
