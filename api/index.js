'use strict'

var mongoose=require('mongoose');
var app = require('./app');//importa la configuracion de express
var port=3800;

//Conexion base de datos
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')//{useMongoClient:true}
                 .then(()=>{
                     console.log("La conexion a la base de datos curso_mean_social se ha realizado correctamente");
                    
                     //Crear servidor
                     app.listen(port,()=> {
                        console.log('listening on 3800')
                      });  

                    })
                 .catch(err=>console.log(err));
