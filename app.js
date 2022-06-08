var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const knex = require('./knexfile');


var countriesRouter = require('./routes/countries');
var volcanoesRouter = require('./routes/volcanoes');
var volcanoRouter = require('./routes/volcano');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');
var meRouter = require('./routes/me');
var swaggerRouter = require('./routes/swagger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

logger.token('req', (req, res) => JSON.stringify(req.headers))
logger.token('res', (req, res) => {
    const headers = {}
    res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
    return JSON.stringify(headers)
})

app.use((req, res, next) => {
    req.db = knex
    next()
})
app.use(cors());


app.use('/countries', countriesRouter);
app.use('/volcanoes?', volcanoesRouter);
app.use('/volcano', volcanoRouter);
app.use('/user/register', registerRouter);
app.use('/user/login', loginRouter);
app.use('/user', profileRouter);
app.use('/me', meRouter);
app.use("/", swaggerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404, "Page not found!"));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};


    // render the error page
    res.status(err.status || 500).json({"status": "error", "message": err.message});
    //res.render('error');
});

module.exports = app;
