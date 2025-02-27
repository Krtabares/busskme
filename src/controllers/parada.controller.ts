/*
  Empresa         : Bioonix
  Aplicación      : Api de Busskm
  Módulo          : Archivo para crud de paradas
  Fecha creación  : 15 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Busskm
*/

import express, { Request, Response } from "express";
import Parada from "../models/parada.models";
import mongoose from "mongoose";
import { paradaSchema } from "../schemas/parada.schema";
import { httpCode } from "../utils/httpStatusHandle";
import {ObjectId} from 'mongodb';



export const getParada = async (req: Request, res: Response): Promise<Response> => {
   const { id } = req.params; 
   if(id === null || id === undefined || !id || !ObjectId.isValid(id)){
      return res.status(httpCode[409].code).json({
         data_send: "",
         num_status: httpCode[409].code,
         msg_status: 'Id is invalid'
      });
   }
   const dat = await Parada.findOne({_id: id});
   //validamos que exista la información
   try {
      if(!dat){
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'No parada found'
         });
      }
      return res.status(httpCode[200].code).json({
         data_send: dat,
         num_status: httpCode[200].code,
         msg_status: 'Parada found successfully'
      });
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem with the server, try again later '
      })
   }
   
}

export const getDataParadas = async (req: Request, res: Response): Promise<Response> => {
   const dat = await Parada.find();
   
   //validamos que exista la información
   try {
      if(dat.length === 0){
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'No parada found'
         });
      }
      return res.status(httpCode[200].code).json({
         data_send: dat,
         num_status: httpCode[200].code,
         msg_status: 'Parada found successfully'
      });
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem with the server, try again later '
      })
   }
   
}

export const create = async (req: Request, res: Response): Promise<Response> => {

   const { rutaid,codigo,nombre,latitud,longitud} = req?.body   
   if(rutaid === null || rutaid === undefined || !rutaid || !ObjectId.isValid(rutaid)){
      return res.status(httpCode[409].code).json({
         data_send: "",
         num_status: httpCode[409].code,
         msg_status: 'Id es inválido'
      });
   } 
   const dat = await Parada.findOne({codigo: codigo});
   if(dat !== null || dat){
      return res.status(httpCode[409].code).json({
         data_send: "",
         num_status: httpCode[409].code,
         msg_status: 'El código de la parada ya está en uso'
      });
   }

   const qr ="";       
   const newParada = new Parada({
      rutaid:rutaid,      
      codigo: codigo.toUpperCase(),
      nombre: nombre.toUpperCase(),
      latitud:latitud,
      longitud:longitud,
      cod_qr:qr      
   });

   try {
      
      await newParada.save();
      
      return res.status(httpCode[201].code).json(
      {  
         data_send: newParada,         
         num_status:httpCode[201].code,
         msg_status: 'Parada creada satisfactoriamente.'
      });
      
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem with the server, try again later '
      })
   }
}

export const update = async (req: Request, res: Response): Promise<Response> => {
   try {
            
      const { rutaid,codigo,nombre,latitud,longitud} = req.body;
      const id = req.params.id;
      if(id === null || id === undefined || !id || !ObjectId.isValid(id)){
         return res.status(httpCode[409].code).json({
            data_send: "",
            num_status: httpCode[409].code,
            msg_status: 'Id is invalid'
         });
      } 
      const dat = await Parada.findOne({codigo: codigo});
      if(dat !== null || dat){
         return res.status(httpCode[409].code).json({
            data_send: "",
            num_status: httpCode[409].code,
            msg_status: 'El código de la parada ya está en uso'
         });
      }
      //generar codigo qr
      const qr = "";
      const updrut = await Parada.findOneAndUpdate({_id: id}, 
         {$set: {
            rutaid: rutaid,
            nombre   : nombre.toUpperCase(),            
            codigo    : codigo.toUpperCase(),  
            latitud:latitud,
            longitud:longitud,
            cod_qr:qr
         }}, 
         {new: true});
      if(!updrut) {
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'No Parada found'
         });
      }
      return res.status(httpCode[200].code).json({
         data_send: {
            updrut            
         },
         num_status: httpCode[200].code,
         msg_status: 'Route updated successfully'
      });
                              
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem trying to modify the route, try again later (ruta)'         
      })
   }
}

export const deleteParada = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;
      // Find the route by id and Delete the ruta cambiando activo a false      
      if(id === null || id === undefined || !id || !ObjectId.isValid(id)){
         return res.status(httpCode[409].code).json({
            data_send: "",
            num_status: httpCode[409].code,
            msg_status: 'Id is invalid'
         });
      } 
      const dat = await Parada.findById(id);
      if (!dat) {
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'No route found'
         });
      }

      // Update the category properties      
      dat.activo = false;

      // Save the updated ruta      
      await dat.save();

      return res.status(httpCode[200].code).json({
         data_send: {
            "codigo": dat.codigo.toUpperCase(), 
            "nombre": dat.nombre.toUpperCase(), 
            "activo": dat.activo,
            "aprobado": dat.aprobado             
         },
         num_status: httpCode[200].code,
         msg_status: 'Parada delete successfully'
      });
                        
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem trying to modify the route, try again later (ruta)'         
      });
   }
}

export const reactivarParada = async (req: Request, res: Response): Promise<Response> => {
   try {
      const { id } = req.params;
      
      if(id === null || id === undefined || !id || !ObjectId.isValid(id)){
         return res.status(httpCode[409].code).json({
            data_send: "",
            num_status: httpCode[409].code,
            msg_status: 'Id is invalid'
         });
      } 
      const dat = await Parada.findById(id);
      if (!dat) {
         return res.status(httpCode[404].code).json({
            data_send: "",
            num_status: httpCode[404].code,
            msg_status: 'No route found'
         });
      }
          
      dat.activo = true;
          
      await dat.save();

      return res.status(httpCode[200].code).json({
         data_send: {
            "codigo de parada": dat.codigo.toUpperCase(), 
            "parada": dat.nombre.toUpperCase(), 
            "activo": dat.activo,
            "aprobado": dat.aprobado             
         },
         num_status: httpCode[200].code,
         msg_status: 'Parada eliminada satisfactoriamente.'
      });
                        
   } catch (error) {
      return res.status(httpCode[500].code).json({
         data_send: "",
         num_status: httpCode[500].code,
         msg_status: 'There was a problem trying to modify the route, try again later (ruta)'         
      });
   }
}
