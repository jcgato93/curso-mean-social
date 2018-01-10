'use strict'

var User=require('../models/user');

function home(req,res){
    res.status(200).send({
        message:"Home ... hola mundo"
    });
}


function pruebas(req,res){
    res.status(200).send({
        message:"test peticion pruebas"
    });
}



module.exports={
    home,
    pruebas
}