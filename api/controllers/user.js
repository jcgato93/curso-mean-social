'use strict'
var bcrypt=require('bcrypt-nodejs');
var mongoosePaginate=require('mongoose-pagination');//para la paginacion de las consultas a la base de datos
var fs=require('fs');//para manejo de archivos "file system"
var path=require('path');//para manejo de directorios

var User=require('../models/user');
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


/**
 * Retorna la informacion de un usuario segun el Id
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req,res){

    var userId=req.params.id;

    User.findById(userId,(err,user)=>{

        if(err) return res.status(500).send({message:'Error en la peticion'});

        if(!user) return res.status(404).send({message:'El usuario no existe'});

        return res.status(200).send({user});
    });
}


/**
 * Retorna Un listado de los Usuarios paginados
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req,res){

    /*como en el request viene token y se decodifica 
    con la informacion del usuario en el decodificador esta la propiedad sub
    que contiene el id del usuario logueado*/ 
    var identity_user_id=req.user.sub;
    

    var page=1;//por defecto
    if(req.params.page){
         page=req.params.page;

    }

    var itemsPerPage=1;//cantidad de elementos por pagina

    //sort para ordenar por
    //page el numero de la pagina 
    //itemsPerPage  cantidad de items por pagina
    //en la opcion del callback  err(captura de errores)  users(query que devolvera de la db) total(total de registros retornados)
    User.find().sort('_id').paginate(page,itemsPerPage,function(err,users,total){

        if(err) return res.status(500).send({message:'Error en la peticion'});

        //si no existe users
        if(!users) return res.status(404).send({message:'No hay usuarios disponibles'});
       

        //si llega hasta aqui se retorna this
        return res.status(200).send({
             users,
             total,
             page:Math.ceil(total/itemsPerPage)//numero de paginas que retornara
        });

    });


}



/**
 * Actualiza la informacion de un usuario
 * @param {*} req 
 * @param {*} res 
 */
function updateUser(req,res){

    var userId=req.params.id;
    var update=req.body;

    //borrar la propiedad password
    delete update.password;

    //si el objeto que se esta enviando tiene el mismo id que el decodificaco  con el token
    //userId  objeto
    //sub  userId decodificado
    if(userId !=req.user.sub){
        return res.status(500).send({message:'No tienes permisos para actulizar estos datos'})
    }

    //el parametro new:tru es para que retorne el objeto actualizado y no el anterior a la actualizacion
    User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdate)=>{

        if(err) return res.status(500).send({message:'Error en la peticion'});

        if(!userUpdate) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

        return res.status(200).send({user:userUpdate});

    });
     



}



/**
 * Subir archivos de imagen/avatar de usuario
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req,res){
    var userId=req.params.id;

    //si existe el campo files con datos
    if(req.files){
       var file_path=req.files.image.path;//toma el path de la imagen del request
       console.log(file_path)
       var file_split=file_path.split('\\') //cortar el nombre del archivo
       console.log(file_split);

       var file_name=file_split[2];//este captura el nombre del archivo

       var ext_split=file_name.split('\.');//este separa el nombre del archivo para saber que extension tiene
       var file_ext=ext_split[1];//toma el nombre de la extension

    //si el objeto que se esta enviando tiene el mismo id que el decodificaco  con el token
    //userId  objeto
    //sub  userId decodificado
       if(userId !=req.user.sub){  
           //delete file that was upload from middleware  
           removeFilesOfUploads(res,file_path,'No tienes permisos para actulizar estos datos');        
         }
        
       if(file_ext=='png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif' ){
         //si la extension es correcta , actualiza la imagen del usuario
         User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdate)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});

            if(!userUpdate) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
    
            return res.status(200).send({user:userUpdate});
         });

       }else{
           //si la extension es incorrecta borra el archivo previamente cargado
          removeFilesOfUploads(res,file_path,'Extension no valida');
       }       

    }else{
        return res.status(200).send({message:'No se han subido imagenes'});        
    }
    
}




//===================== Local Functions ==================================

/**
 * Borra el archivo que se pasa por parametro en la ruta
 * @param {*response} res 
 * @param {*ruta archivo} file_path 
 * @param {*} message 
 */
function removeFilesOfUploads(res,file_path,message){
    fs.unlink(file_path,(err)=>{//borrar el archivo
        if(err) return res.status(200).send({message:message});
    });
}



module.exports={
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage
}