const mongoose = require('mongoose');
const validator = require('validator');
const User = require('../models/userModel');

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    default: null
  }, dateLiked: {
    type: Date,
    default: Date.now()
  }
},  { _id: false });

const viewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    default: null
  }, dateViewed: {
    type: Date,
    default: Date.now()
  }
},  { _id: false });

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    default: null
  }, dateCommented: {
    type: Date,
    default: Date.now()
  }, text: {
    type: String,
    required:[true,'Comment text is required'],
    trim: true
  }
},  { _id: false });


const schemaOptions= {
  collection:'questions',
  // strict: 'throw', //strict default is true but can also be set to false to allow all values insertion
  versionKey: false
};
const questionSchema = new mongoose.Schema(
  {
    text: {
      type:String,
      required:[true,'Question text is required'],
      trim: true
    },
    topic:{
      type: Number,
      default: 1,
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: User,
      default: null
    },
    contact :{
      name: {
        type:String,
        trim: true
      },
      phone: {
        type:String,
        trim: true
      },
      email: {
        type:String,
        minlength:5,
        maxlength:255,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
          if(!validator.isEmail(value)){
            throw new Error('Email is invalid')
          }
        }
      }
    },
    likes: {
      type: [likeSchema],
    },
    comments: {
      type: [commentSchema],
    },
    views: {
      type: [viewSchema],
    }

  }
  ,schemaOptions);



questionSchema.pre('validate', function(next) {
  if (( !this.contact.email || this.contact.email === '') && ( !this.contact.phone || this.contact.phone === '')) {
    next(new Error('Either email or Phone is required.'));
  } else {
    next();
  }
});

const Question = mongoose.model('question',questionSchema);
module.exports = {Question, likeSchema, viewSchema};



