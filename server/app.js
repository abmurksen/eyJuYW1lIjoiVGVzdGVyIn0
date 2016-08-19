var express = require('express');
var app = express();
var mongo = require('./db/mongo');
var path = require('path');
var bodyParser = require('body-parser');

var adminRouter = require('./api/routers/adminRoute');
var userRouter = require('./api/routers/userRoute');
var teacherRouter = require('./api/routers/teacherRoute');
var commonRouter = require('./api/routers/commonRoute');

var jwt = require('jsonwebtoken');
var path = require('path');


app.use(bodyParser.json());
app.use('/../bower_components', express.static(path.normalize(__dirname + '/../client/bower_components')));
app.use('/media',express.static(path.normalize(__dirname + '/../uploadFiles')));
app.use(express.static(path.normalize(__dirname + '/../client')));
app.use(express.static(path.normalize(__dirname + '/../client/dist')));

app.use('/admin',adminRouter);
app.use('/user',userRouter);
app.use('/teacher',teacherRouter);
app.use('/',commonRouter);


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
 // res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000 !');
});
