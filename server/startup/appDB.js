const mongoose = require('mongoose');
const logger = require('../middleware/winston-logging.js');
// Connection URL
const db_name = process.env.DB_NAME;
const url = 'mongodb://'+process.env.DB_USERNAME+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+db_name;


mongoose.connect(url,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error',function(){
  logger.info(`Connection Failed to ${db_name}`);
});
db.once('open', function(){
  logger.info(`Connected to Database: ${db_name}`);
});
mongoose.Promise = global.Promise;



module.exports = {
  close: function(callback){
    mongoose.disconnect();
  }
};
