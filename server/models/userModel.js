const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schemaOptions= {
  collection:'users',
  strict: 'throw', //strict default is true but can also be set to false to allow all values insertion
  versionKey: false,
  timestamp: true
};

const userSchema = new mongoose.Schema({
  alias: {
    type:String,
    minlength:5,
    maxlength:50,
    trim: true,
  },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password". Please choose a different password.')
            }
        }
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
  firstName:{
    type: String
  },
  lastName: {
    type: String
  },
  status:{
    type: Number,
    enum: [0,1,2],
    default: 0
  },
  roles: {
    type: [String],
    enum: ['U','A','M', 'S', 'D', 'Y'],//U: User, A: Associate, M: manager, S: Sr. manager, D: Admin, Y: System Admin
    default: 'U'
  },
  gender: {
    type: String,
    enum: ['M','F','O'],
    default: 'M'
  },
  address:{
    lines:[String],
    city: String,
    state: String,
    zip: String
  },
  dob:{
    type: Date
  },
  contact :{
    phones: [String]
  },
  userType: {
    type:String,
    minlength: 1,
    maxlength: 1,
    default: 'S',
    enum: ['S','G','F','T']// System User

  },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatarData:{
        type: Buffer  // to store pictures
    },
  avatar:{
    type: Boolean  // avatar present or not
  }
}, schemaOptions);
// Express while sending user object in response calls JSON.strringify to convert user
//object to JSON and whenever JSON.stringify is called the toJSON method is called automatically if there

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    // delete userObject.password
    delete userObject.tokens;
    delete userObject.avatarData;

    return userObject;
};
//Instance methods available on particular instance
userSchema.methods.generateAuthToken = async function(){
  console.log('In generate auth token');
const user = this;
    const token  = jwt.sign(({_id: user._id.toString()}),process.env.JWT_PRIVATE_KEY,{expiresIn:'7 days'});
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
   };
//statistics Model available on collection
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email}).select('_id alias email roles avatar password tokens');
    if(!user){
        throw new Error('Unable to Login!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to Login!');
    }
    return user;
};

// Normal function used as arrow functions do not support this
userSchema.pre('save', async function(next) {

    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

const User = mongoose.model('User',userSchema);



module.exports = User;
