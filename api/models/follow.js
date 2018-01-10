'user strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;//usar la clase Schema

//Crear los campos y los tipos de datos 
var FollowSchema=Schema({

    user:{type:Schema.ObjectId,ref:'User'},
    followed:{type:Schema.ObjectId,ref:'User'}
});


//exportar el modelo para su accesibilidad
module.exports=mongoose.model('Follow',FollowSchema);