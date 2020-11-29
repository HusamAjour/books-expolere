'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const superagent = require('superagent');

app.set('view engine', 'ejs');


app.listen(PORT, ()=>{
  console.log(`listening on port ${PORT}`);
});
