/*
  Empresa         : Bioonix
  Aplicación      : Api de Busskm
  Módulo          : Archivo que define la configuración para la conexión a la BD y otras configuraciones
  Fecha creación  : 23 de Mar del 2024
  Modificado el   :
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Busskm
*/
import 'dotenv/config';

export default {
   JWT_SECRET  : process.env.JWT_SECRET || 'BioonixBusskmTurismarAguilaKey17$*',
   RUN_MODE    : false,
   DB: { 
      URI   : process.env.MONGODB_URI,
      USER  : process.env.MONGODB_USER,
      PASW  : process.env.MONGODB_PASSW,
      HOST  : process.env.MONGODB_HOST,
      PORT  : process.env.MONGODB_PORT,
      NAME  : process.env.MONGODB_NAME     
   },
   URL:{
      FRONT: "https://padelwebvercel-ct3k7mrao-humbertodevelops-projects.vercel.app/",
      ADMIN: "https://padelwebvercel-ct3k7mrao-humbertodevelops-projects.vercel.app/",
      BACKEND: "https://rhnrkzk3-3000.use2.devtunnels.ms/"
   },
   MAIL: {
      correo: "jlramirez17@gmail.com",
      passw: process.env.MAIL_PASSW,
      path_confirm: "http://localhost:3000/auth/confirm-account/",
      path_confirm_admin: "http://localhost:3000/auth/account/confirm-admin",
      path_validate: "http://localhost:3000/auth/validar-cuenta/", 
      path_login: "http://localhost:3000/auth/login/" 
   },
   FBK: {
      clientID: process.env.FBK_ID || "730716712424276",
      clientSecret: process.env.FBK_SECRET || "7080d44bea7e664b3b9acc722620a202",
      callBackUrl: "http://localhost:3000/auth/facebook/callback",
      secretSession: "Aguila17_mejorando_el_mundo_bpadelranking"
   },
   EMPRESA:{
      nombre      : "Busskm Turismar",
      rif         : "J999999990",
      direccion   : "Turismar, Isla de Margarita",
      correo_emp  : "jl.ramirez17@outlook.es"
   },
   STORAGEAPI:{
      destination:"storage",
      banderapais:"storage/imgs/banderas",
      fotoperfil:"storage/imgs/user",
      fotop:"storage/imgs/perfil/user",      
      imgschofer:"storage/imgs/chofer",
      imgsvehiculo:"storage/imgs/vehiculo",
      imgsorganizacion:"storage/imgs/organizacion",

   }
}
