//ejemplo de actualizacion de hot reload
/*console.log("hola desde Nodejs,esto esta en hot reload")*/
 //const express=require(`express`);
 //importar la libreria para crear un servidor web-commosJS9echa script 6
 //instanciar nuestra aplicacion web

 import generalRoutes from './routes/generalRoutes.js'; 
 import userRoutes from './routes/userRoutes.js'; 
 
 import express from 'express';
 const app = express();
 
 const port = 3000;
 app.listen(port, () => {
     console.log(`La aplicación ha iniciado en el puerto: ${port}`);
 });
 
 app.use('/', generalRoutes);
 app.use('/usuario', userRoutes);
 
 


 