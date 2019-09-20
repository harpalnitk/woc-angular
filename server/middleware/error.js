const logger = require('./winston-logging.js');
module.exports = function(err,req,res,next){
    logger.log('error',err.message);
    //logger.error(err.message,err);
    res.status(500).send('Internal Server Error');
    next();
}

//error
//warn
//info
//verbose
//debug
//silly