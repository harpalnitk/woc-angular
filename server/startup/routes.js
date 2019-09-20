const apiAuthRouter = require('../routes/auth');
const apiUsersRouter = require('../routes/user');
const apiAdminRouter = require('../routes/admin');
const apiAllRouter = require('../routes/all');
const apiQuestionRouter = require('../routes/question');
const apiAnswerRouter = require('../routes/answer');
const bodyParser = require("body-parser");


module.exports = function (app) {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use("/api/auth", apiAuthRouter);
    app.use("/api/user", apiUsersRouter);
    app.use("/api/admin", apiAdminRouter);
    app.use("/api/all", apiAllRouter);
    app.use("/api/question", apiQuestionRouter);
    app.use("/api/answer", apiAnswerRouter);
}
