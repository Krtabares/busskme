/*
  Empresa         : Bioonix
  Aplicación      : Api de Busskm 
  Módulo          : Archivo que define la configuración para la conexión a la BD
  Fecha creación  : 23 de Mar del 2024
  Modificado el   : 15-04-24
  Programador     : JLRAMIREZ
  Colaboración    :
  Descripción     : Api para enviar y manejar la información de Busskm
*/

import express, { urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config/config';
import { connectDB } from './database';
import passport, { Passport } from 'passport';
import passportMiddleware from './middlewares/protectedroutes.middleware';
import {checkAuth} from './config/config.jwt';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
const basicAuth = require('express-basic-auth');
import initialConfig from './config/initialConfig';
import path from 'path';
import 'dotenv/config';

//imported routes
import authRoutes from './routes/auth.routes'
import authConfirmRoutes from './routes/auth.routes'
import protectedRoutes from './routes/protected.routes'
import userRoutes from './routes/users.routes'
import userAuthRegisterRoutes from './routes/users.routes'
import paisRoutes from './routes/pais.routes'
import edoRoutes from './routes/estados.routes'
import ciudadRoutes from './routes/ciudad.routes'
import categoriaRoutes from './routes/educacion.routes'
import rutaRoutes from './routes/ruta.routes'
import paradaRoutes from './routes/parada.routes'
import vehiculoRoutes from './routes/vehiculo.routes'
import marcaRoutes from './routes/marca.routes'
import modeloRoutes from './routes/modelo.routes'
import roleRoutes from './routes/role.routes'
import choferRoutes from './routes/chofer.routes'
import operadorRoutes from './routes/operador.routes'
import educacionRoutes from './routes/educacion.routes'
import colorRoutes from './routes/color.routes'
import organizacionRoutes from './routes/organizacion.routes'
import municipioRoutes from './routes/municipio.routes'
import metodoPagoRoutes from './routes/metodopago.routes'
import calificarChoferRoutes from './routes/calificarchofer.routes'
import BaseRoutes from './routes/base.routes'
import notificacionesRoutes from './routes/notificacion.route'
import ItinerariosRoutes from  './routes/itineratio.routes'
import IncidenciasRoutes from './routes/Incidencia.routes'
import PagosRoutes from './routes/pago.routes'
import ServicioRoutes from './routes/servicio.routes'
import WalletRoutes from './routes/wallet.routes'
import TicketRoutes from './routes/ticket.routes'
import TipoPreferencialRoutes from './routes/tipopreferencial.routes'
import TarifaRoutes from './routes/tarifa.routes'
import ReservaRoutes from './routes/reserva.routes'
import ReporteOperativo from './routes/reporteOperativo.routes'
import TarifaAdicionalRoutes from './routes/tarifaAdicional.routes'
import { validaFechasVencimiento } from './controllers/notificacion.controller';

//import fbkRoutes from './routes/fbk.routes'

//conexión a la bd
connectDB();

//initializations
const app = express()

// settings

app.set('port', process.env.PORT || 4000)

//crear directorio storage si no existe
initialConfig.cerateDirStorage();

//crear Roles y usuario superadmin;
initialConfig.createRolesAndUser();


// validaFechasVencimiento()

//middlewares
app.use(morgan('dev'))
const corsOptions = {
   origin: 'https://rhnrkzk3-3000.use2.devtunnels.ms/', // Cambia esto al dominio correcto de tu cliente
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true, // Si estás manejando cookies o autenticación
 };
 app.use(cors({
   origin: '*',
   credentials: false
 }));
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Methods', '*')
   res.setHeader('Access-Control-Allow-Headers', '*')
   next()
});

console.log("inicio: hola mundo");


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: config.FBK.secretSession, resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session());
passport.use(passportMiddleware)

//routes
app.get('/', (req, res) => {
   res.send(`The API Busskm, is running in http://localhost:${app.get('port')}`)
})

app.use("/api-docs",basicAuth({
   users: {'busskm': 'busskm.bioonix'},
   challenge: true,
}), swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//rutas de autenticación sin validacion de autenticate
app.use('/auth',authRoutes);

app.use('/auth/account/',passport.authenticate('jwt', {session: false}),authConfirmRoutes);

//ruta para registrar usuario cliente desde la app o web, sin authenticate
app.use('/user/auth',userAuthRegisterRoutes);
app.use('/user',userRoutes);
//app.use('/user',userRoutes);

//app.use('/admin',checkAuth,passport.authenticate('jwt', {session: false}),adminRoutes);
app.use('/pais',paisRoutes);
app.use('/estado',edoRoutes);
app.use('/ciudad',ciudadRoutes);
app.use('/municipio',municipioRoutes);
app.use('/category',passport.authenticate('jwt', {session: false}),categoriaRoutes);
app.use('/ruta',rutaRoutes);
app.use('/chofer',choferRoutes);
app.use('/operador', operadorRoutes)
app.use('/organizador',organizacionRoutes);
app.use('/educacion',educacionRoutes);
app.use('/parada',paradaRoutes);
app.use('/vehiculo',vehiculoRoutes);
app.use('/vehiculo/marca',marcaRoutes);
app.use('/vehiculo/modelo',modeloRoutes);
app.use('/vehiculo/color',colorRoutes);
app.use('/roles',roleRoutes);
app.use('/metodo-pago',metodoPagoRoutes);
app.use('/calificar-chofer',calificarChoferRoutes);
app.use('/Base', BaseRoutes);
app.use('/notificaciones', notificacionesRoutes);
app.use('/itinerario', ItinerariosRoutes)
app.use('/incidencia', IncidenciasRoutes)
app.use('/pago', PagosRoutes)
app.use('/servicio', ServicioRoutes)
app.use('/ticket', TicketRoutes)
app.use('/wallet', WalletRoutes)
app.use('/tipoPreferencial', TipoPreferencialRoutes)
app.use('/tarifa', TarifaRoutes)
app.use('/reserva', ReservaRoutes)
app.use('/reporte-operativo', ReporteOperativo)
app.use('/tarifa-adicional', TarifaAdicionalRoutes)
app.use('/storage',express.static(path.resolve(config.STORAGEAPI.destination)));
app.use(passport.authenticate('jwt', {session: false}),protectedRoutes);
//app.use('/login/facebook',fbkRoutes);
export default app

//Componente de esquema de seguirdad
/**
 * @swagger
 * components:
 *    securitySchemes:
 *       apiAuth:
 *          type: apiKey
 *          in: header
 *          name: authorization 
 */