const express= require('express');
const error_custom = require('./middleware/error');
require('./startup/appDB')

const app = express()

app.use(express.json())
require('./startup/routes')(app);
app.use(error_custom);



module.exports = app
