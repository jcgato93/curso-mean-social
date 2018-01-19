'user strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;//usar la clase Schema
var mongoosePaginate=require('mongoose-pagination');



//Crear los campos y los tipos de datos 
var UserSchema=new mongoose.Schema({

    name:String,
    surname:String,
    nick:String,
    email:String,
    password:String,
    role:String,
    image:String
});



//exportar el modelo para su accesibilidad
module.exports=mongoose.model('User',UserSchema);


