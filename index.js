//ejemplo de actualizacion de hot reload
/*console.log("hola desde Nodejs,esto esta en hot reload")*/
 //const express=require(`express`);
 //importar la libreria para crear un servidor web-commosJS9echa script 6
 //instanciar nuestra aplicacion web

 import express from 'express';
 import generalRoutes from './routes/generalRoutes.js'; 
 import userRoutes from './routes/userRoutes.js'; 
 
 const app = express();
 
 app.set('view engine', 'pug');
 app.set('views', './views');   
 const port = 3000;
 
 app.use(express.json()); // Para manejar JSON en las peticiones
 
 app.use('/', generalRoutes);
 app.use('/usuario', userRoutes);
 
 app.listen(port, () => {
     console.log(`La aplicación ha iniciado en el puerto: ${port}`);
 });
 
 


 