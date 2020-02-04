const key = require("./env/key");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const {
  registerRouter,
  authRouter,
  authCheckRouter,
  authValidateAuthRouter,
  authLogoutRouter,
  todoRouter,
  todoPushRouter,
  todoToggleRouter,
  todoRemoveRouter,
  todoRearrangeRouter
} = require("./routers");

const app = express();
const passport = require("./passport")();
const myStore = require("./session")();
myStore.sync();

// Use required middleware
app.use(
  session({
    secret: key.session.key,
    resave: false,
    saveUninitialized: false,
    store: myStore
  })
);
app.use(passport.initialize());
app.use(passport.session());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Enable CORS
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4000/auth/logout"
];
app.use(function(req, res, next) {
  if (ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    // allow all origins to make unauthenticated CORS requests
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-PINGOTHER, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  next();
});

// Routing
app.get("/api", (req, res) => {
  /* console.log("SESSION at main route /", req.session);
  console.log("after serilalization ", req.session.passport);
  console.log("after deserialization req.user ", req.user); */
  //res.redirect("http://localhost:3000");
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    res.redirect("https://chillnwork.com");
  } else if (process.env.NODE_ENV === "development") {
    res.redirect("http://localhost:3000");
  }
});
app.post("/api/register", registerRouter);
app.post("/api/auth", authRouter);
// client checks with server so user can retry if the user entered the wrong info
app.post("/api/auth/check", authCheckRouter);
app.post("/api/auth/validateAuth", authValidateAuthRouter);
app.post("/api/auth/logout", authLogoutRouter);
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "email",
      "https://www.googleapis.com/auth/calendar"
    ]
  })
);
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google"
  }),
  function(req, res) {
    console.log("authentication successful");
    res.redirect("/api");
  }
);
app.post("/api/data/todo", todoRouter);
app.post("/api/data/todo/push", todoPushRouter);
app.post("/api/data/todo/toggle", todoToggleRouter);
app.post("/api/data/todo/remove", todoRemoveRouter);
app.post("/api/data/todo/rearrange", todoRearrangeRouter);
app.listen(4000, function() {
  console.log("Example app listening on port 4000!");
});
