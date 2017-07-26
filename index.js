// express is web app framework and attach diff http calls
// pulls obj out o fpackage
const express = require('express');
// this express comes from line 1 to substantiate the function
// usees all functions/methods inside he guy
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const router = require('./router.js');
// including this from library and havent includeed user table, so dont need /
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect('mongodb://localhost:bucket/bucket');

app.use(cors());
// when we call .json, the info associated w/ body of request, make sure it is json
// */* means make sure either side is json
app.use(bodyParser.json({type: '*/*'}));
// put this beneath bdoyparser b/c the requests coming in need to be read as json
router(app);

const port = process.env.PORT || 3000;
// open port on machine
const server = http.createServer(app)
// vs. app.listen(port 3000 is just preference)
server.listen(port);
console.log('Server is listening on ' + port)