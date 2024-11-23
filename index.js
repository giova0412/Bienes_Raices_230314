import express from 'express';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js';

// ? Crear la app
const app = express();

// ? Configuración de la vista
app.set('view engine', 'pug');
app.set('views', './Views');

// ? Habilitar la lectura de los datos de un formulario
app.use(express.urlencoded({ extended: true }));

// ? Habilitar cookie Parser
app.use(cookieParser());

// ? Habilitar CSRF
app.use(csurf({ cookie: true }));

// ? Archivos estáticos
app.use(express.static('./public'));

// ? Conexión a la base de datos
try {
    await db.authenticate();
    await db.sync(); // Asegúrate de que esto esté en espera
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
}

// ? Rutas
app.use('/', generalRoutes);
app.use('/auth', userRoutes);

// ? Middleware para manejar el error de CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).send('Token CSRF no válido');
    }
    next(err);
});

// ? Inicio del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});