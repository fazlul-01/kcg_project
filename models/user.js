var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    school: String,
    standard: Number,
    mobile: String
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);