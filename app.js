const express = require('express'),
      bp = require('body-parser');

const app = express();

require('dotenv').config();
require('./config/db');

const pingRoute = require('./routes/pingRoute');

app.use(bp.urlencoded({extended : true}));
app.use(bp.json());

app.use('/', pingRoute)

app.listen(process.env.SERVER_PORT)
