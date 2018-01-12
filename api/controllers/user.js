'use strict'

var User=require('../models/user');
var bcrypt=require('bcrypt-nodejs');
var jwt=require('../services/jwt');



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



/**
 * Registra un usuario y lo guarda en la base de dadtos
 * @param {String} req Requiere un modelo de Usuario
 * @param {*} res 
 */
function saveUser(req,res){
    var params=req.body;//capturar solo el body de la peticion o request
    var user=User();//instanciar un model User
    
    if(params.name && params.surname && 
       params.nick && params.email && params.password){//si el modelo con todos los parametros esta bien

         //asigna los parametros al objeto user
          user.name=params.name;
          user.surname=params.surname;
          user.nick=params.nick;
          user.email=params.email;
          user.role='ROLE_USER';
          user.image=null;
          
        //Verificar si el usuario si ya existe en la base de datos
         User.findOne({$or:[
                        {email:user.email.toLowerCase()},
                        {nick:user.nick.toLowerCase()}
                        ]
                      } ).exec((err,users)=>{
                         if(err) return res.status(500).send({message:'Error en la peticion de usuarios'});

                         if(users && users.length>=1){
                             return res.status(200).send({message:'El usuario que intenta registrar ya existe!!'});
                         }
                      });

          //Encriptacion del password y guarda los datos
          bcrypt.hash(params.password,null,null,(err,hash)=>{
              user.password=hash;

              user.save((err,userStored)=>{
                  if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                  
                  if(userStored){
                      res.status(200).send({user:userStored});
                  }
                  else{
                      res.status(404).send({message:'No se ha registrado el usuario'});
                  }
                });
          });

       }
       else{
           res.status(200).send({
             message:'Envia todos los campos necesarios'
           });
       }

}


/**
 * Verifica si un usuario existe en la base de datos y retorna su informacion si 
 * se encuentra en ella
 * @param {*} req requiere un objeto user 
 * @param {*} res 
 */
function loginUser(req,res){
    var params=req.body;
    

    var email=params.email;
    var password=params.password;

    User.findOne({email:email},(err,user)=>{//busca el email en la base de datos
 
        if(err)return res.status(500).send({message:'Error en la peticion'});

        if(user){//si el usuario fue encontrado en la db
            bcrypt.compare(password,user.password,(err,check)=>{//compara el password suministrado con el almacenado
                if(check){//si es correcto 
                    //devolver datos de usuario
                    if(params.gettoken){
                        
                        //generar y devolver token
                        return res.status(200).send({
                        token:jwt.createTroken(user)
                        });
                    }else{
                        //devolver datos de usuario
                        user.password=undefined;
                        return res.status(200).send({user})
                    }

                   
                }else{//si no concuerda
                    return res.status(500).send({message:'El usuario no se a podido identificar'});
                }
                
            });
        }else{//si el email no se encuentra
            return res.status(500).send({message:'El usuario no se ha podido identificar'});
        }

    });
}


module.exports={
    home,
    pruebas,
    saveUser,
    loginUser
}