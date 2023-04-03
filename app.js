var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('file-system');
var mongoose = require('mongoose');

var app = express();

mongoose.set('strictQuery', false);
const mongoDB = "mongodb://127.0.0.1/testing_express_apps";
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

fs.readdirSync('controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    const route = require('./controllers/' + file)
    route.controller(app)
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function () { console.log('listening on 3000') })
module.exports = app;
