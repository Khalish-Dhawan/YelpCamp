if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError");
const catchAsync = require("./utility/catchAsync");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");

const campgrounds = require("./routes/campgrounds");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const MongoStore = require("connect-mongo")(session);

// "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "thisshouldbeabettersecret";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

const mongoose = require("mongoose");
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch(() => {
    console.log("OH NO ERROR!!");
  });

app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = new MongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "ontop",
  secret,
  resave: false,
  saveUninitialized: true,
  useUnifiedTopology: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use("/", users);
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "nanu@gmail.com",
    username: "Nanu",
  });
  const newUser = await User.register(user, "nanu");
  res.send(newUser);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    err.message = "Oh No,Something Went Wrong!!";
  }
  res.status(status).render("error", { err });
});

const port = process.env.PORT || 4000;

app.listen(port, (req, res) => {
  console.log(`LISTENING ON PORT ${port}!!`);
});
