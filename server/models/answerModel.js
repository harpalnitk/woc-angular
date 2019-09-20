

const mongoose = require('mongoose');
const validator = require('validator');
const User = require('../models/userModel');
const {Question, likeSchema, viewSchema} = require('../models/questionModel');

const Schema = mongoose.Schema;

const schemaOptions= {
  collection:'answers',
  // strict: 'throw', //strict default is true but can also be set to false to allow all values insertion
  versionKey: false
};
const answerSchema = new mongoose.Schema(
  {
    text: {
      type:String,
      required:[true,'Answer text is required'],
      trim: true
    },
    questionId:{
      type: Schema.Types.ObjectId,
      ref: Question,
      default: null
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: User,
      default: null
    },
    likes: {
      type: [likeSchema],
    },
    views: {
      type: [viewSchema],
    }

  }
  ,schemaOptions);



const Answer = mongoose.model('answer',answerSchema);
module.exports = Answer;

