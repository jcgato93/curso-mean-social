'user strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;//usar la clase Schema

//Crear los campos y los tipos de datos 
var MessageSchema=Schema({

    text:String,
    created_at:String,
    emitter:{type:Schema.ObjectId,ref:'User'},
    receiver:{type:Schema.ObjectId,ref:'User'}
});


//exportar el modelo para su accesibilidad
module.exports=mongoose.model('Message',MessageSchema);