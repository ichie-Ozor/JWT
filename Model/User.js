const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please entera valid email']
    },
    password: {
       type: String,
       required: [true, 'Please enter an password'],
       minlength: [6, 'The minimum password length is 6 characters']
    }
})

//fire a function after a doc saved to db
userSchema.post('save', function (doc, next) {  //the 'post' here is not like that of a http request but actually a mongoose hook which tells the mongoose to do something after something has happened
    console.log('new user was created & saved', doc);
    next();  //whenever we call a mongoose function, we should call the next function so that the mongoose can progress to the next action
});

//fire a function before a doc is saved
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

const User = mongoose.model('user', userSchema)

module.exports = User;