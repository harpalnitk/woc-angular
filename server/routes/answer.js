const express = require('express');
const router = express.Router();
const Answer = require('../models/answerModel');
const {Question} = require('../models/questionModel');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const _ = require('lodash');
const logger = require('../middleware/winston-logging.js');

router.post('/add',[auth], async function (req, res, next) {
  logger.info('Inside add answer');
  let answer = new Answer();
  let question = null;
  console.log('ANSWER',answer);
  try{
    answerFromRequestBody(answer, req);
    logger.info('Answer: '+ JSON.stringify(answer));
    await answer.save();
    //TODO limit sub documents of question
    question =  await Question.findByIdAndUpdate(answer.questionId, {$inc: {answer_count: 1}},{new: true})
    logger.info('answer3: '+ JSON.stringify(answer));
    return res.status(200).json({success: true, answer: answer, question: question});
  }catch(e){
    logger.error('Error in Adding Answer', e.message);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }

});

function answerFromRequestBody(answer, request) {
  answer.text = request.body.text;
  answer.questionId = request.body.questionId;
  answer.user = request.user.id;
}

module.exports = router;
