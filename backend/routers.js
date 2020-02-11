const pgp = require("pg-promise")(/*options*/);
const dbKeys =
  process.env.NODE_ENV === "production"
    ? require("./env/key").postgresql_prod
    : require("./env/key").postgresql_dev;
const connectionStr = `postgres://${dbKeys.username}:${dbKeys.password}@${dbKeys.host}:${dbKeys.port}/${dbKeys.database}`;
const db = pgp(connectionStr);
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const passport = require("./passport")();

module.exports = {
  registerRouter: function registerRouter(req, res, next) {
    const { email, password } = req.body;
    console.log("email and password passed to registerRouter", email, password);
    console.log(`This is ${process.env.NODE_ENV} environment`);
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
              //console.log("Error in hashing the password", err);
            }
            // Store hash in your password DB.
            const pw = hash;
            db.one(
              `INSERT INTO users (id, email, password) VALUES 
                  ($1, $2, $3) RETURNING id, email, password`,
              [id, email, pw]
            )
              .then(function(user) {
                //console.log("DATA created:", user);

                // register successful...login the user
                req.logIn(user, function(err) {
                  if (err) {
                    console.log("login error");
                    return next(err);
                  }
                  //console.log("login successful!!");
                  req.session.is_loggedin = true;
                  //console.log("---SESSION data----", req.session);
                  //res.status(200).send("registration successful");
                  if (process.env.NODE_ENV === "production") {
                    res.redirect("https://chillnwork.com");
                  } else if (process.env.NODE_ENV === "development") {
                    res.redirect("http://localhost:3000");
                  }
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
      //console.log(" user in /auth", user);
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
        //console.log("login successful!!");
        req.session.is_loggedin = true;
        //console.log("---SESSION data----", req.session);
        //res.status(200).send("login successful :)");
        if (process.env.NODE_ENV === "production") {
          res.redirect("https://chillnwork.com");
        } else if (process.env.NODE_ENV === "development") {
          res.redirect("http://localhost:3000");
        }
      });
    })(req, res, next);
  },
  authCheckRouter: function authCheckRouter(req, res, next) {
    const { email, password } = req.body;
    //console.log("data passed to /auth/check", email, password);

    db.oneOrNone("SELECT id, email, password FROM users WHERE email = $1", [
      email
    ])
      .then(data => {
        if (data) {
          //console.log("retrieved data ", data);
          if (bcrypt.compareSync(password, data.password)) {
            //console.log("user email and password matched", data);
            res.send(data.id);
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
    //console.log("PRINTING REQ.SESSION", req.session);
    //console.log("PRINTING REQ.USER", req.user);

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
  },
  todoRouter: function todoRouter(req, res, next) {
    const email = req.body.email;
    db.manyOrNone(
      "SELECT * FROM todolist WHERE email = $1 ORDER BY order_id ASC",
      [email]
    )
      .then(function(todos) {
        console.log("Todos from DB", todos);
        res.send(todos);
      })
      .catch(function(err) {
        console.log("Could not get Todos from DB", err);
      });
  },
  todoPushRouter: function todoPushRouter(req, res, next) {
    const { email, task, done } = req.body;
    db.one("SELECT MAX(order_id) FROM todolist WHERE email = $1", [email])
      .then(function(response) {
        const order_id = response.max === null ? 1 : parseInt(response.max) + 1;
        db.one(
          `INSERT INTO todolist (email, task, done, order_id) VALUES 
              ($1, $2, $3, $4) RETURNING email, task, done, order_id`,
          [email, task, done, order_id]
        )
          .then(function(data) {
            //console.log("Todo inserted into DB", data);
            res.send(data);
          })
          .catch(function(err) {
            console.log("Couldn't insert Todo into DB", err);
          });
      })
      .catch(function(err) {
        return console.log(
          "Couldn't retreive todolist with the email provided",
          err.response
        );
      });
  },
  todoToggleRouter: function todoToggleRouter(req, res, next) {
    const { id } = req.body;
    db.one("SELECT done FROM todolist WHERE order_id = $1", [id])
      .then(function(data) {
        db.none("UPDATE todolist SET done = $1 WHERE order_id = $2", [
          !data.done,
          id
        ])
          .then(function(response) {
            console.log("toggle todo in db", id);
            res.send(response);
          })
          .catch(function(err) {
            console.log("Couldn't toggle Todo in the DB", err.response);
          });
      })
      .catch(function(err) {
        console.log(
          "Couldn't retrieve todolist from DB with id",
          err.response,
          id
        );
      });
  },
  todoRemoveRouter: function todoRemoveRouter(req, res, next) {
    const { id } = req.body;
    db.none("DELETE FROM todolist WHERE order_id = $1", [id])
      .then(function(response) {
        res.send(response);
      })
      .catch(function(err) {
        console.log("Couldn't delete Todo in the DB", err.response, id);
      });
  },
  todoRearrangeRouter: function todoRearrangeRouter(req, res, next) {
    const { source_idx, destination_idx } = req.body;
    console.log("source and destination", source_idx, destination_idx);
    db.none("UPDATE todolist SET order_id = $1 WHERE order_id = $2", [
      -1,
      destination_idx
    ])
      .then(function(response) {
        db.none("UPDATE todolist SET order_id = $1 WHERE order_id = $2", [
          destination_idx,
          source_idx
        ])
          .then(function(response) {
            db.none("UPDATE todolist SET order_id = $1 WHERE order_id = $2", [
              source_idx,
              -1
            ]).then(function(response) {
              console.log("rearrange successful", response);
            });
          })
          .catch(err =>
            console.log("Error rearranging todolist in DB", err.response)
          );
      })
      .catch(err =>
        console.log("Error rearranging todolist in DB", err.response)
      );
    res.send("Update successful");
  }
};
