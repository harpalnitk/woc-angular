const logger = require('./middleware/winston-logging.js');
const app = require('./app')
const chalk = require('chalk');
const port = process.env.PORT

app.listen(port, () => {
  logger.info(`'Server is running on port: ${port}`)
  console.log(chalk.green.inverse('Server is running on port: '+ port))
})

process.on('SIGINT',function(){
  logger.info('SIGINT');
  require('/server/startup/appDB').close(function(){
    process.exit(0);
  });
});
