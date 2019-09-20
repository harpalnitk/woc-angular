const express= require('express');
const router = new express.Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {sendCancellationEmail} = require('../emails/account');
const logger = require('../middleware/winston-logging.js');





router.get('/me',[auth],async (req,res)=> {
  try{
    res.send(req.user);
  }catch(e){
    logger.error('Error in Loading User', e);
    res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
  }
});


router.patch('/edit',[auth], async (req,res)=>{
    const updates = Object.keys(req.body);
  console.log(updates);
    const allowedUpdates = ['alias','password','firstName','lastName','gender','address','dob','contact'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({message: 'INVALID_UPDATES'});
    }
    try{
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(e){
      logger.error('Error in Editing User', e);
        res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
    }
});

router.delete('/users/me',[auth], async (req,res)=>{
    try{
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    }catch(e){
      logger.error('Error in Deleting User', e);
        res.status(500).send({message: 'INTERNAL_SERVER_ERROR', stackTrace: e.stackTrace});
    }
});
//TO STORE IMAGES IN FOLDER ON SERVER
// const upload = multer({
//     dest: 'avatars',
//     limits:{
//         fileSize: 1000000 //1 Mb
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             cb(new Error('File must be in .jpg .jpeg or.png format!'))
//         }
//         cb(undefined, true)
//     }
// })
//TO STORE IMAGES IN DATABASE
const upload = multer({
    //dest: 'avatars',
    //REMOVING DEST ALLOWS UPLOADED FILE DATA TO BE PASSED ON TO THE CALLBACK FUNCTION
    //ON REQUEST OBJECT FILE PROPERTY
    limits:{
        fileSize: 1000000 //1 Mb
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('File must be in .jpg .jpeg or.png format!'));
        }
        cb(undefined, true);
    }
});

router.post('/upload/avatar',[auth,upload.single('avatar')],async (req,res)=>{
    logger.info('User ID: ' + req.body.id);
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    const id = req.body.id;
    if(id !== '0') {
      logger.info('admin profile update');
     await User.findByIdAndUpdate(id, { $set: { avatarData: buffer, avatar: true }});
      res.send({
        success: true, path: 'api/user/'+id+'/avatar'
      });
    } else {
      logger.info('Profile update image');
      req.user.avatarData = buffer;
      req.user.avatar = true;
      await req.user.save();
      res.send({
        success: true, path: 'api/user/'+req.user.id+'/avatar'
      });
    }

},(error,req,res)=>{
    res.status(400).send({error: error.message});
});

//TO SHOW BINARY DATA ON HTML PAGE
//<img src="data:image/jpg;base64,PUT BINARY DATA HERE>

router.delete('/delete/avatar',auth,async (req,res)=>{
    req.user.avatarData = undefined;
    req.user.avatar = false;
    await req.user.save();
    res.send({
      success: true
    })
},(error,req,res)=>{
    res.status(400).send({error: error.message});
});

router.get('/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type','image/png');
        res.send(user.avatarData);
    }catch(e){
        res.status(404).send({message: 'Error in loading user image',stackTrace: e.stackTrace});
    }
});
//http://localhost:3000/users/5c9327740e1b9b1510abd34d/avatar
//To see image use this URL
module.exports = router;
