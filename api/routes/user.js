'use strict'

var express=require('express');

var UserController=require('../controllers/user');

var api=express.Router();
var md_auth=require('../middlewares/authenticated');



api.get('/home',UserController.home);
api.post('/prueba',md_auth.ensureAuth,UserController.pruebas);//en este primero pasa por el middleware para autenticacion del token
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);



module.exports=api;