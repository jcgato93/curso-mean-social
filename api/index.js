'use strict'

var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social',{useMongoClient:true})
                 .then(()=>{
                     console.log("La conexion a la base de datos curso_mean_social se ha realizado correctamente")
                 })
                 .catch(err=>console.log);
