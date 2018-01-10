'use strict'

var express = require('express');
var bodyParser=require('body-parser');

var app = express();




//========cargar rutas===============
var user_routes=require('./routes/user');



//========= middlewares ====================
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());//parsea las peticiones en un objeto json



//======== cors ==========



//========rutas ======================
app.use('/api',user_routes);



//=========exportar cofiguracion del express
module.exports=app;