const express= require('express');
const router = new express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const logger = require('../middleware/winston-logging.js');
const _ = require('lodash');

router.get('/userList', [auth], async function (req, res) {
  logger.info('Inside get users list in admin');
  let searchString = req.query.search;
  logger.info('Search String' + searchString);
  let query = {};
  if (searchString && searchString !== '' && searchString !== undefined) {
    searchString = new RegExp(searchString, 'i');
    query = {$or: [{'alias': searchString}, {'firstName': searchString}, {'lastName': searchString}]};
  }
  logger.info(`Query: ${query}`);
  let sort = req.query.sort;
  let order = req.query.order;
  let offset = req.query.offset;
  let limit = req.query.limit;
  logger.info(`Sort: ${sort} Order: ${order} Offset: ${offset} Limit: ${limit}`);
  //Sort: created Order: asc Page: 1
  order = (order === 'asc') ? 1 : -1;
  logger.info(`Sort: ${sort} Order: ${order} Offset: ${offset} Limit: ${limit}`);
  try{
    //const total_count = await User.find(query).countDocuments();
    //const users = await User.find(query).skip(+offset).limit(+limit).sort({[sort]: order}).select('-password');
    const result = await User.aggregate([
      {$match : query},
      {$sort: {[sort]:order}},
      {$project: {password: 0, avatarData: 0, tokens: 0}},
      {$facet:{
          users: [{ $skip: +offset }, { $limit: +limit}],
          totalCount: [
            {
              $count: 'count'
            }
          ]
        }}
      ]);
    return res.status(200).json({users: result[0].users, total_count: result[0].totalCount[0].count});
  }catch(e){
    logger.error('Error in Loading User List in Admin', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.get('/:id',[auth,validateObjectId],async function (req, res) {
  logger.info('Inside get user in admin');
  const userId = req.params.id;

  let user = null;
try{
  user = await User.findById(userId).select('-avatarData -tokens -address -contact');
  console.log(user);
  if(!user){
    return res.status(404).send({message:`USER_NOT_FOUND`});
  }else{
    return res.status(200).json(_.pick(user,['_id','alias','email','password','firstName','lastName','avatar','roles','userType','status']));
  }
}catch(e){
  logger.error('Error in getting User in Admin', e);
  res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
}
});

router.patch('/:id/edit',[auth, validateObjectId] ,async function (req, res, next) {
  logger.info('Inside edit user in admin');
  const userId = req.params.id;
  console.log('User Id'+ userId);

  let updates = Object.keys(req.body);
  updates = updates.filter(v => v !== 'email'); // Email must not be edited in any case
  const allowedUpdates = ['alias','password','firstName','lastName','roles','userType','status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if(!isValidOperation){
    return res.status(400).send({message: 'INVALID_UPDATES'});
  }

  try{
    let user = await User.findById(userId).select('-avatarData -tokens -address -contact');;
    //logger.info('User:'+ user);
    if(!user){
      return res.status(404).send({message:`User with User id ${userId} not found.`});
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.status(200).send(_.pick(user,['_id','alias','email','password','firstName','lastName','gender','avatar','roles','userType','status']));
  }catch(e){
    logger.error('Error in editing User in Admin', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.post('/add', [auth], async function (req, res, next) {
  logger.info('Inside add user in admin');
  let email = req.body.email ? req.body.email : '';
  try{
  let user = await User.findOne({'email' : email}).select('_id email');
  console.log(user);
  if (user) {
    return res.status(400).send({message: `USER_ALREADY_REGISTERED`});
  }
  user = new User();
  userFromRequestBody(user, req);
  user = await user.save();
  return res.status(200).json(_.pick(user,['_id','alias','password','firstName','lastName','address','dob','contact','email','avatar','roles','userType','status']));
  }catch(e){
    logger.error('Error in adding new User in Admin', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

router.delete('/:id', [auth, validateObjectId], async function (req, res) {
  logger.info('Inside delete user in admin');
  let userId = req.params.id;
  console.log('User Id' + userId);
  try{
  const user = await User.findByIdAndRemove(userId).select({alias:1, email:1});
  let response_message = user.alias ? user.alias : `with email ${user.email}`;
  return res.status(200).json({success: true, message: `User: ${response_message} deleted successfully`});
  }catch(e){
    logger.error('Error in deleting User in Admin', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});

function userFromRequestBody(user, request) {
  user.email = request.body.email;
  user.alias = request.body.alias;
  user.password = request.body.password;
  user.firstName = request.body.firstName;
  user.lastName = request.body.lastName;
  user.status = request.body.status;
  user.roles = request.body.roles;
  // user.contact = {
  //   phones: request.body.contact ? request.body.contact.phones : '',
  // };
  // user.address = {
  //   lines: request.body.address ? ( request.body.address.lines ? request.body.address.lines.split(os.EOL) : '') : '',
  //   city: request.body.address ? request.body.address.city : '',
  //   state: request.body.address ? request.body.address.state : '',
  //   zip: request.body.address ? request.body.address.zip : ''
  // };
  user.userType = request.body.userType;
  // user. = request.body.imageURL;
}


module.exports = router;
