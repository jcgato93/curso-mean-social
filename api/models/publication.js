'user strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;//usar la clase Schema

var PublicationSchema=Schema({

    text:String,
    file:String,
    created_at:String,
    user:{tye:Schema.ObjectId,ref:'User'}
});


//exportar el modelo para su accesibilidad
module.exports=mongoose.model('Publication',PublicationSchema);