/*
  Empresa         : Bioonix
  Aplicación      : Api de Busskm
  Módulo          : Archivo para definir la funcion de cada ruta de auth usuarios
  Fecha creación  : 25 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Busskm
*/

import express, { Request, Response } from "express";
import User from "../../models/users.models";
import {getToken, getTokenData} from "../../config/config.jwt";
import {sendMail, getTemplateHtml} from "../../config/config.mail";
import  utilsHandle  from "../../utils/utilsHandle";
import { httpCode } from "../../utils/httpStatusHandle";
import {ObjectId} from 'mongodb';

export const home = (req: Request, res: Response) => {
   res.send('Bienvenido al inicio del sistema Best Padel Ranking');   
}

export const login = async (req: Request, res: Response) => {
   
   const { correo, clave } = req?.body
      
   const user = await User.findOne({correo: correo}).populate('roles','nombre');
   if(!user) {
      return res.status(httpCode[404].code).json({
         data_send: "",         
         num_status:httpCode[404].code,
         msg_status: 'The user does not exist!'         
      })
   }
   
   if(user.confirmado === false){
      return res.status(httpCode[409].code).json({
         data_send: "",         
         num_status:httpCode[409].code,
         msg_status: 'The account must be confirmed by the user, to be able to log in!'         
      })
   }
      
   if(user.intentos === 3){
   
      const accion = "validar";         
      const token = getToken({ correo, id: user._id, roles: user.roles, idcode: user.idcode},'3d');      
      const html = getTemplateHtml(user.nombre, token, user.idcode, accion, "","");

      await sendMail(correo, 'Su cuenta debe ser validada', html);
      return res.status(httpCode[409].code).json({
         data_send: "",         
         num_status:httpCode[409].code,
         msg_status: 'Your account needs to be validated, Best padel ranking has sent you an email, verify and follow the instructions!'         
      })
   }
   
   user.comparePassword(clave).then((match: boolean) => {
      if(!match) {
         const intent = user.intentos+1;
        actIntentos(intent, correo,true); 
        return res.status(httpCode[409].code).json({
          data_send: "",         
          num_status:httpCode[409].code,
          msg_status: `Invalid User/password combination. On the third attempt the account will be suspended. You have (${3-intent}) attempts left.`
        })        
      }else{         
         if(user.intentos > 0){
            actIntentos(0, correo,false);
         }
      }
         
      
      const token = getToken({ correo, id: user._id, afiliado: user.idcode,  roles: user.roles},'3d');
    
      return res.status(httpCode[200].code).json({
        data_send: {token, user_id: user._id, user_nombre: user.nombre, afiliado: user.idcode, activo: user.activo, perfil: user.roles},
        num_status:httpCode[200].code,
        msg_status: 'Login successfully'
      })
   });   
}


export const modifyPassword = async (req: Request, res: Response): Promise<Response> => {
   const { correo, oldPassword, newPassword } = req.body;

   try {
      // Find the user by correo
      const user = await User.findOne({ correo });

      // Check if the user exists
      if (!user) {
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'User not found'
         });
      }

      // Check if the old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
         return res.status(httpCode[409].code).json({
            data_send: "",
            num_status: httpCode[409].code,
            msg_status: 'Old password is incorrect'
         });
      }

      // Update the password
      user.clave = newPassword;
      await user.save();

      return res.status(httpCode[200].code).json({
         data_send: "",
         num_status: httpCode[200].code,
         msg_status: 'Password modified successfully'
      });
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem trying to modify the route, try again later (ruta)'         
      });
   }
}

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
   const { correo, newPassword } = req.body;

   try {
      // Find the user by correo
      const user = await User.findOne({ correo });

      // Check if the user exists
      if (!user) {
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'User not found'
         });
      }
      
      // Update the password
      user.clave = newPassword;
      await user.save();

      return res.status(httpCode[200].code).json({
         data_send: "",
         num_status: httpCode[200].code,
         msg_status: 'Password reset successfully'
      });
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem trying to modify the route, try again later (ruta)'         
      });
   }
}


export const confirmAccount = async (req: Request, res: Response): Promise<Response> => {
   
   const {token} = req.body;
         
   const data = getTokenData(token);
   if(data === null){
      return res.status(httpCode[404].code).json({
         data_send: "",
         num_status: httpCode[404].code,
         msg_status: 'Authentication failed, invalid token'
      });
   }
   const _id = data.data.id;
   
   if(!token || token === null || token === undefined || !data || data === null){
      return res.status(httpCode[404].code).json({
         data_send: "",
         num_status: httpCode[404].code,
         msg_status: 'Authentication failed, invalid token'
      });
   }
   const user = await User.findById({ _id });
   if (!user) {
      return res.status(httpCode[404].code).json({
         data_send: "",
         num_status: httpCode[404].code,
         msg_status: 'Usuario no autenticado, credenciales son incorrectas.'
      });
   } 

   if (user.confirmado === true) {
      return res.status(httpCode[202].code).json({
         data_send: "",
         num_status: httpCode[202].code,
         msg_status: 'Enlace de confirmación ya ha sido usado, ya puede iniciar sesión.'
      });
   } 
   user.confirmado = true;
   await user.save();

   return res.status(httpCode[200].code).json({
      data_send: "",
      num_status: httpCode[200].code,
      msg_status: 'Autenticación correcta, su cuenta ha sido confirmada, inicie sesión.'
   });  
   
}

export const validatedAccount = async (req: Request, res: Response) => {
   //recibimos código enviado por el usuario y el token 
   const {id, aleatorio, token} = req.body;
      
   //obtenemos la data del token y verificamos que sea correcta
   const data = getTokenData(token);
   if(data === null){
      return res.status(httpCode[401].code).json({
         data_send: "",
         num_status: httpCode[401].code,
         msg_status: 'Authentication failed, invalid token'
      });
   }
   const correo = data.data.correo;
   const _id = data.data.id;   
   const ale = data.data.aleatorio;
       
   const user = await User.findById({ _id });
   if (!user) {
      return res.status(httpCode[404].code).json({
         data_send: "",
         num_status: httpCode[404].code,
         msg_status: 'User not found'
      });
   }   
   if(aleatorio !== ale){
      return res.status(httpCode[401].code).json({
         data_send: "",
         num_status: httpCode[401].code,
         msg_status: 'Authentication failed, invalid code'
      });
   }
   user.intentos = 0;
   await user.save(); 
   return res.status(httpCode[200].code).json({
      data_send: "",
      num_status: httpCode[200].code,
      msg_status: 'Successful authentication, validated account. Sign in again, or change your password'
   });    
}

async function actIntentos(intentos: number, correo: string, reset:boolean): Promise<Boolean> {
   if(!reset){
      intentos=0;
   }
   try {      
      const updus = await User.findOneAndUpdate({correo: correo}, 
         {$set: {
            intentos: intentos
         }}, 
         {new: true});
      if(!updus) {
        return false;
      }
      return true;      
   } catch (error) {
      return false;
   }   
}
