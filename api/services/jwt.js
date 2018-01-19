'use strict'

var jwt=require('jwt-simple');
var moment=require('moment');
var secret='clave_secreta_curso_desarrollar_red_social_angular';

/**
 * Genera los tokens
 * @param {*} user 
 */
exports.createTroken=function(user){


    var payload={
        
        sub:user._id,
        name:user.name,
        surname:user.surname,
        nick:user.nick,
        email:user.email,
        role:user.rolle,
        image:user.image,
        iat:moment().unix(),//inicia en 
        exp:moment().add(30,'days').unix//explira en 
    };

   return jwt.encode(payload,secret);

};