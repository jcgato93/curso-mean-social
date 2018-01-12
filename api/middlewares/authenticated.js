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
    if(!req.headers.authorization){
        return res.status(403).send({message:'La peticion no tiene la cabecera de autenticacion'});
    }


    var token=req.headers.authorization.replace(/['"]+/g,'');//quitar comillas simples o dobles

    try {
        var payload=jwt.decode(token,secret);
        if(payload.exp<=moment().unix()){
            return res.status(401).send({
              message:'El token ha expirado'
            });
        }    
    } catch (error) {
        return res.status(404).send({
            message:'El token no es valido'
        });
    }
    
    req.user=payload;

    next();//instruccion para que siga con el siquiente metodo

}