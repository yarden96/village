const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config').get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
    id:{
        type:String,
        required:true,
        uniqe:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength: 6
    },
    name:{
        type:String,
        required:true,
        maxlength: 100
    },
    lastname:{
        type:String,
        required:true,
        maxlength: 100
    },
    role:{
        type:String,
        default:'User'
    },
    numberOfDuties:{
        type:Number,
        default:0
    },
    dutiesDates:{
        type:Date
    },
    token:{
        type:String
    }
})

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){ 
                if(err) next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log("isMatch", candidatePassword, this.password);

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), config.SECRER);

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    jwt.verify(token, config.SECRER, function(err, decode) {
        user.findOne({ "_id": decode,"token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

userSchema.methods.deleteToken = function(token, cb) {
    let user = this;

    user.update({$unset:{token}}, (err, user) => {
        if(err) return cb(err);
        cb(null, user);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };