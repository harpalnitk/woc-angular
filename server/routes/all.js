const express = require('express');
const router = express.Router();
const {Question} = require('../models/questionModel');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const logger = require('../middleware/winston-logging.js');
const _ = require('lodash');

router.post('/:category/like/:id',[auth, validateObjectId],async function (req, res) {
  const category = req.params.category;
  logger.info(`Inside like in ${category}`);
  const id = req.params.id;
  try{
    let like_update =    {
      $push: {
        likes:
          {
            user: req.user.id,
            $currentDate: {dateLiked: true}
          }
        }
    };
    // let funct =  Function(`return  ${category}.findOneAndUpdate({_id: ${id}, 'like.user': {$ne: ${req.user.id}},like_update, {new: true})`);
    // let model  = await funct();

     let model = await Question.findOneAndUpdate({_id: id, 'likes.user': {$ne: req.user.id}},like_update, {new: true}).select('likes');
    if(!model){
      return res.status(404).send({message:`${category}_NOT_UPDATE_WITH_LIKE`});
    }else{
      return res.status(200).json(model);
    }
  }catch(e){
    logger.error(`Error in updating likes for ${category} : ${id}`, e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.post('/:category/unLike/:id',[auth, validateObjectId],async function (req, res) {
  const category = req.params.category;
  logger.info(`Inside unlike in ${category}`);
  const id = req.params.id;
  try{
   let unlike_update =    {
      $pull: {
        likes: { user : req.user.id}
      }
    };
    let model = await Question.findOneAndUpdate({_id: id, 'likes.user': req.user.id},unlike_update, {new: true}).select('likes');
    if(!model){
      return res.status(404).send({message:`${category}_NOT_UPDATE_WITH_UNLIKE`});
    }else{
      return res.status(200).json(model);
    }
  }catch(e){
    logger.error(`Error in updating unlikes for ${category} : ${id}`, e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.get('/:category/likeStatus/:id',[auth, validateObjectId],async function (req, res) {
  const category = req.params.category;
  logger.info(`Inside like status in ${category}`);
  const id = req.params.id;
 // console.log('Question ID:', req.params.id);
  //console.log('User Id:', req.user.id);
  try{
    let query =    {
      _id: id,
      'likes.user' : req.user.id
    };
    //TODO get only boolean value from mogodb server rather than full question object
    let model = await Question.findOne(query).select('_id');
    //console.log('Question:',model);
    if(!model){
      return res.status(200).send({like: false, id: id});
    }else{
      return res.status(200).json({like: true, id: id});
    }
  }catch(e){
    logger.error(`Error in fetching like status for ${category} : ${id}`, e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.post('/:category/comment/:id',[auth, validateObjectId],async function (req, res) {
  const category = req.params.category;
  logger.info(`Inside post comment in ${category}`,  req.body.text);
  const id = req.params.id;

  try{
    if(!req.body.text || req.body.text === '') {
      return res.status(404).send({message:`${category}_COMMENT_TEXT_CANNOT_BE_EMPTY`});
    }
    let comment_update =    {
      $push: {
        comments: {
            user: req.user.id,
            $currentDate: {dateCommented: true},
            text: req.body.text
       }
      }
    };

    let model = await Question.findOneAndUpdate({_id: id},comment_update, {new: true}).select('comments');
    if(!model){
      return res.status(404).send({message:`${category}_NOT_UPDATE_WITH_COMMENT`});
    }else{
      return res.status(200).json(model);
    }
  }catch(e){
    logger.error(`Error in posting comment for ${category} : ${id}`, e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

module.exports = router;
