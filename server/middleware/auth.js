const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const logger = require('../middleware/winston-logging.js');
const auth = async (req,res,next)=>{
   try{
       const token = req.header('Authorization').replace('Bearer ','')
       const decoded = jwt.verify(token,process.env.JWT_PRIVATE_KEY)
       const user = await User.findOne({_id: decoded._id,'tokens.token':token}).select('-avatarData')
       if(!user){
           logger.info('Unauthorized User');
           throw new Error()
       }
       req.token = token
       req.user = user
       next()
   }catch(e){
       logger.error('Unauthorized User',e);
       res.status(401).send({message: 'Login to continue!', stackTrace: e.stackTrace})
   }
}

module.exports = auth
