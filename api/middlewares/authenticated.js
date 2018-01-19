'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_curso_desarrollar_red_social_angular';

/**
 * Decodifica el token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.ensureAuth=function(req,res,next){

    if(!req.headers.authorization){//verrifica que en el header se el cuentre el parametro Authorization
        return res.status(403).send({message:'La peticion no tiene la cabecera de autenticacion'});
    }


    var token=req.headers.authorization.replace(/['"]+/g,'');//quitar comillas simples o dobles

    try {
        var payload=jwt.decode(token,secret);//token a decodificar, clave secreta
        if(payload.exp<=moment().unix()){//verifica el tiempo de duracion del token
            return res.status(401).send({
              message:'El token ha expirado'
            });
        }    
    } catch (error) {
        return res.status(404).send({
            message:'El token no es valido'
        });
    }
    
    req.user=payload;//si se decodifica el token correctamente retorna la informacion del usuario

    next();//instruccion para que siga con el siquiente metodo

}