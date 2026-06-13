const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
     
});
//we use this plugin because it automatic generate password and salt
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);