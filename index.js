//ejemplo de actualizacion de hot reload
/*console.log("hola desde Nodejs,esto esta en hot reload")*/
 //const express=require(`express`);
 //importar la libreria para crear un servidor web-commosJS9echa script 6
 //instanciar nuestra aplicacion web
 import express from "express"
 const app=express()

 const port=3000
 app.listen(port,()=>{
    console.log(`La aplkicacion ha iniciado en el puerto :${port}`)
 })
 //routing -enrutamiento para peticiones

 app.get("/",function(req, res){
    res.send("hola desde la web en nodeJs")
 })
 app.get("/quienEres",function(req, res){
    res.json(
        {
            "nombre":"giovany raul",
            "carrera":"ti dsm",
            "grado":"4",
            "grupo":"A"

        }
    )
 })
 

 