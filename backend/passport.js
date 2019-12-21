module.exports = function() {
  const passport = require("passport");
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  const google = require("./env/key").google;
  const pgp = require("pg-promise")(/*options*/);
  const keys = require("./env/key").postgresql;
  const connectionStr = `postgres://${keys.username}:${keys.password}@${keys.host}:${keys.port}/${keys.database}`;
  const db = pgp(connectionStr);
  const shortid = require("shortid");
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcryptjs");

  console.log("invoke passport");

  passport.serializeUser(function(user, done) {
    console.log("----SERIALIZE----", user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("----DESERIALIZE----");

    db.oneOrNone(`SELECT * FROM users WHERE id = $1`, [id])
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        console.log("ERROR in Deserialization ", err);
      });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "login-email",
        passwordField: "login-password"
      },
      function(email, password, done) {
        console.log("Email passed to passport", email);
        db.oneOrNone("SELECT id, email, password FROM users WHERE email = $1", [
          email
        ])
          .then(function(user) {
            console.log("user pulled", user);
            // Load hash from your password DB.
            if (user) {
              const hash = user.password;
              //console.log("hash ", hash);
              bcrypt.compare(password, hash, function(err, res) {
                // res === true
                if (res === true) {
                  console.log("You entered the correct password");
                  done(null, user);
                } else {
                  console.log("You entered the wrong password");
                  done(null, false);
                }
              });
            } else {
              console.log("user does not exist");
              done(null, false);
            }
          })
          .catch(function(err) {
            console.log("ERROR ", err);
          });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: google.clientId,
        clientSecret: google.clientSecret,
        callbackURL: "http://localhost:4000/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log("\n\n\n\n\n\n\n\n\nProfile ", profile);

        const email = profile.emails[0].value;

        db.oneOrNone(`SELECT * FROM users WHERE email = $1`, [email])
          .then(function(user) {
            // if user is stored in db pass the user to serializeUser
            if (user) {
              return done(null, user);
            } else {
              // store user in db otherwise
              const id = shortid.generate();
              db.one(
                `INSERT INTO users (id, email, displayname, googleid) VALUES 
                ($1, $2, $3, $4) RETURNING id, email, displayname, googleid`,
                [id, email, profile.displayName, profile.id]
              )
                .then(function(user) {
                  console.log("DATA created:", user);
                  return done(null, user);
                })
                .catch(function(error) {
                  console.log("ERROR:", error);
                });
            }
          })
          .catch(function(err) {
            console.log("ERROR", err);
          });
      }
    )
  );
  return passport;
};
