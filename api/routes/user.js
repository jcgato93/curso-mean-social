'use strict'

var express=require('express');

var UserController=require('../controllers/user');

var api=express.Router();
var md_auth=require('../middlewares/authenticated');//middleware par autenticacion de tokens


var multipart=require('connect-multiparty');//para subir archivos

var md_upload=multipart({uploadDir:'./uploads/users'})//middleware para indicar el directorio de subida




api.get('/home',UserController.home);
api.post('/prueba',md_auth.ensureAuth,UserController.pruebas);//en este primero pasa por el middleware para autenticacion del token
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);//puede recibir como parametro la pagina
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);//en md_upload,sube el archivo a la carpeta correspondiente


module.exports=api;