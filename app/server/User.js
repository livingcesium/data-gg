const mongoose = require('mongoose') 
const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
}) 

const User = mongoose.model("User", UserSchema) 

module.exports = User 