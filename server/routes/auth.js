const express= require('express');
const router = new express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const {sendWelcomeEmail} = require('../emails/account');
const logger = require('../middleware/winston-logging.js');
const _ = require('lodash');
const validator = require('validator');

const expiresIn = '3600'; // Token expiration duration (value in seconds)



router.get('/unique', async (req, res) => {
  let email = req.query.email;
  logger.debug('Path: /auth/unique', email);
  try{
  if(!validator.isEmail(email )) {
    return res.status(400).json({message: `${email} is not a valid email.`});
  }
  let user = await User.findOne({'email' : req.query.email}).select('_id email');
  if(user) return res.status(200).send(true);
  else return res.status(200).send(false);
  }catch(e){
    logger.error('Error in checking email availability', e);
    res.status(500).send({message: 'Internal Server Error. Please try again.', stackTrace: e.stackTrace});
  }
});

router.post('/signUp', async (req,res)=> {
  logger.debug('Path: /auth/signUp');
  const user = new User(req.body);
  logger.debug('User from request: ', user._id);
  try{
    await user.save();
    logger.debug('User saved', user._id);
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
   // res.status(201).send({user,token})
    res.status(201).header('x-auth-token',token).json({message: 'User registered successfully.', user: _.pick(user,['_id','alias','email','roles','avatar']), expiresIn: expiresIn});
  }catch(e){
    logger.error('Error in Sign Up', e);
    res.status(400).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});
router.post('/signIn', async (req,res)=> {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    console.log(user);
    const token = await user.generateAuthToken();
    res.status(202).header('x-auth-token',token).json({message: 'Login successful.', user: _.pick(user,['_id','alias','email','roles','avatar']), expiresIn: expiresIn});
  }catch(e){
    logger.error('Error in Sign In', e);
    res.status(401).send({message: 'UNABLE_TO_LOGIN', stackTrace: e.stackTrace});
  }
});
router.post('/signOut',[auth], async (req,res)=> {
  logger.info('Path: /auth/signOut');
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({message: 'Sign Out Successful!'});
  }catch(e){
    logger.error('Error in Sign Out', e.stackTrace);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.post('/signOutAll',[auth], async (req,res)=> {
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send({message: 'Signed out from all devices!'});
  }catch(e){
    logger.error('Error in Sign Out', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});
module.exports = router;
