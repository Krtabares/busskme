/*
  Empresa         : Bioonix
  Aplicación      : Api de Busskm
  Módulo          : Archivo para definir el model de estados
  Fecha creación  : 05 de Abr del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Busskm
*/


import { Schema, model, Document, ObjectId } from "mongoose";
import {estadoSchema} from "../schemas/estados.schema";

export interface IEstado extends Document {   
   pais: string, //siglas del pais
   paisid: Schema.Types.ObjectId, //idcode de la tabla pais
   estado: string,
   nombre: string,      
   activo: boolean,
   createdAt: Date,
   updateAt: Date
}

export default model<IEstado>('Estado', estadoSchema);