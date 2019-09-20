const express = require('express');
const router = express.Router();
const {Question} = require('../models/questionModel');
const logger = require('../middleware/winston-logging.js');
var mongoose = require('mongoose');



router.post('/add', async function (req, res) {
  logger.info('Inside add question');
  let question = new Question();
  console.log('QUESTION',question);
  try{
    questionFromRequestBody(question, req);
    //logger.info('Question: '+ JSON.stringify(question));
    question = await question.save();
    //logger.info('Question2: '+ JSON.stringify(question));
    //TODO decide whether question need to be returned back and if yes
    // how to move user back to question list page
    return res.status(200).json({success: true, question: question});
  }catch(e){
    logger.error('Error in Adding Question', e.message);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }

});

router.get('/loadQuestionsList', async function (req, res) {
  logger.info('Inside get questions');
  const searchString = req.query.search;
  const topic = req.query.topic;
  const view = req.query.view;
  logger.info(`Search: ${searchString} Topic: ${topic} View: ${view}`);

  let query;
  if(view !== 'all') {
    query = getLoadQuestionListQueryAuthenticated(topic, searchString, view, mongoose.Types.ObjectId(req.query.userId));
  } else {
    query = getLoadQuestionListQuery(topic, searchString);
  }

  logger.info(`Query:`, query);

  let sort = req.query.sort ? req.query.sort : '_id' ;
  let order = (req.query.order === 'asc') ? 1 : -1;
  let offset = req.query.offset ? req.query.offset : 0;
  let limit = req.query.limit ? req.query.limit : 10;
  logger.info(`Sort: ${sort} Order: ${order} Offset: ${offset} Limit: ${limit}`);

  try{
   const count = await Question.find(query).countDocuments();
   logger.info(`Count Questions: ${count}`);
    //TODO  add count also to this query

    //const questions = await Question.find(query).skip(+offset).limit(+limit).sort({[sort]: order}).populate('user', 'avatar alias')
    const result = await Question.aggregate(getPipelineForLoadUserList(sort, query, order, limit, offset));
    //logger.info(`Questions:`, result);
    return res.status(200).json({questions: result, count: count});
  }catch(e){
    logger.error('Error in Loading Question List', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

function getLoadQuestionListQueryAuthenticated(topic, searchString, view, userId) {
  logger.info(`Inside getLoadQuestionListQueryAuthenticated topic: ${topic} searchString : ${searchString} view: ${view} userId: ${userId}`);
  const viewQuery = getViewQuery(view, userId);
  let query = (topic === '1') ? viewQuery : {$and: [{topic: +topic},viewQuery]};
  if (searchString && searchString !== '' && searchString !== undefined) {
    searchString = new RegExp(searchString, 'i');
    if(topic !== '1'){
      query = {$and:[
          {$or: [{'text': searchString}, {'contact.name': searchString}]},
          {topic: topic },
          viewQuery
        ]};
    }else {
      query = {$and:[
          {$or: [{'text': searchString}, {'contact.name': searchString}]},
          viewQuery
        ]};
    }
  }
  return query;
}

function getLoadQuestionListQuery(topic, searchString) {
  logger.info(`Inside getLoadQuestionListQuery topic: ${topic} searchString : ${searchString}`);
  let query = (topic === '1') ? {}: {topic: +topic};
  if (searchString && searchString !== '' && searchString !== undefined) {
    searchString = new RegExp(searchString, 'i');
    if(topic !== '1'){
      query = {$and:[
          {$or: [{'text': searchString}, {'contact.name': searchString}]},
          {topic: topic }
        ]};
    }else {
      query = {$or: [{'text': searchString}, {'contact.name': searchString}]};
    }
  }
  return query;
}

function getViewQuery(view, userId) {
  switch (view) {
    case 'all':
      return {};
    case 'you_posted':
      return {'user': userId};
    case 'you_liked':
      return {'likes.user' : userId}
    case 'you_answered':
      //TODO implement query here
      return {};

  }
}

function getPipelineForLoadUserList(sort, query, order, limit, offset){
  let pipeline = [];
if(sort === 'answer_count') {
  pipeline = [
    {$match : query},
    {$addFields: {like_count: {$cond: {if: {$isArray: "$likes"}, then: {$size: "$likes"}, else: 0}}}},
    {$addFields: {view_count: {$cond: {if: {$isArray: "$views"}, then: {$size: "$views"}, else: 0}}}},
    {$addFields: {comment_count: {$cond: {if: {$isArray: "$comments"}, then: {$size: "$comments"}, else: 0}}}},
    {$lookup:{
        from: 'answers',
        let: { question_id: "$_id" },
        pipeline: [
          { $match:{$expr: { $eq: ["$questionId", "$$question_id"] } }},
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        as: "answer_count"
      }},
    {$sort: {[sort]:order}},
    {$skip: +offset},
    {$limit: +limit},
    {$project: {'likes': 0, 'views': 0, 'comments': 0 }},
    {$lookup: {
        from: 'users',
        let: {user_id: "$user"},
        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$user_id"]}}},
          {$project: {avatar: 1, alias: 1}}
        ],
        as: "user"
      },
    },
    { $unwind: { path: "$answer_count", preserveNullAndEmptyArrays: true }},
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
  ];
}else {
  // No need to populate answer before if sort is not by answer_count, It will be better to have answer_count field in the question document itself
  pipeline = [
    {$match : query},
    {$addFields: {like_count: {$cond: {if: {$isArray: "$likes"}, then: {$size: "$likes"}, else: 0}}}},
    {$addFields: {view_count: {$cond: {if: {$isArray: "$views"}, then: {$size: "$views"}, else: 0}}}},
    {$addFields: {comment_count: {$cond: {if: {$isArray: "$comments"}, then: {$size: "$comments"}, else: 0}}}},
    {$sort: {[sort]:order}},
    {$skip: +offset},
    {$limit: +limit},
    {$project: {'likes': 0, 'views': 0, 'comments': 0 }},
    {$lookup: {
        from: 'users',
        let: {user_id: "$user"},
        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$user_id"]}}},
          {$project: {avatar: 1, alias: 1}}
        ],
        as: "user"
      },
    },
    {$lookup:{
        from: 'answers',
        let: { question_id: "$_id" },
        pipeline: [
          { $match:{$expr: { $eq: ["$questionId", "$$question_id"] } }},
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ],
        as: "answer_count"
      }},
    { $unwind: { path: "$answer_count", preserveNullAndEmptyArrays: true }},
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }
  ];
}
return pipeline;
}




function questionFromRequestBody(question, request) {
  question.text = request.body.text;
  question.topic = request.body.topic ? request.body.topic : question.topic;
  question.user = request.body.user;

  if(request.body.contact && request.body.contact.email  && request.body.contact.email !== ''){
    question.contact = {
      name: request.body.contact ? request.body.contact.name : '',
      phone: request.body.contact ? request.body.contact.phone : '',
      email: request.body.contact.email
    };
  } else {
    question.contact = {
      name: request.body.contact ? request.body.contact.name : '',
      phone: request.body.contact ? request.body.contact.phone : '',
    };
  }
}

module.exports = router;
