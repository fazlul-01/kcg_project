var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    app = express();

//mongoose
const url = 'mongodb://localhost:27017/kcg';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//==================================================
//config
//==================================================
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


//passport
app.use(require("express-session")({
    secret: "iam iron man",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//================================================
//Routes
//================================================

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/index", isLogedIn, function (req, res) {
    res.render("index", {
        currentUser: req.user
    });
})

//===========================
//Passport Routes
//==============================
//register route
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        school: req.body.school,
        standard: req.body.standard,
        email: req.body.email,
        mobile: req.body.mobile,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/index");
            })
        }
    });
});


//login route
app.get("/login", function (req, res) {
    res.render("login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login"
}), function (req, res) {});

//logout routes
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/")
});

function isLogedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login")
    }


}








//====================================================
//listenting at port 3000...
//===================================================
app.listen(3000, function () {
    console.log("staring the server...")
})