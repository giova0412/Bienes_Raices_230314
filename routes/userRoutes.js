import express from 'express';
import { formularioLogin, formularioRegister, formularioPasswordRecovery, createNewUser, confirm, passwordReset, verifyTokenPasswordChange, updatePassword } from '../controllers/userController.js';

const router= express.Router();


//GET - Se utiliza para la lectura de datos e información del servidor al cliente
// EndPoints - Son las rutas para accedes a las secciones o funciones de nuestra aplicacion web
 // 2 componentes de una petición  ruta (a donde voy), función callback (que hago)
// ":" en una ruta definen de manera posicional los parametros de entrada
router.get("/findByID/:id", function (request, response) {
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`);
})     

//POST - Se utiliza para el envío de datos e información del cliente al servidor
router.post("/newUser",createNewUser)

//PUT - Se utiliza para la atualización total de información del cliente al servidor
router.put("/replaceUserByEmail/:name/:email/:password", function(a,b){
    b.send(`Se ha solicitado el remplazo de toda la información del usuario: ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})

//PATCH - Se utiliza para la actualización  parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request, response){
    
    const {email, newPassword, newPasswordConfirm} = request.params  // Desestrucutración de un objeto 

    if(newPassword === newPasswordConfirm)
    {
        response.send(`Se ha solicitado el actualización de la contraseña del usuario con correo: ${email}, se aceptan los cambios ya que la contraseña y confirmación son la misma.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
    else 
    { 
        response.send(`Se ha solicitado el actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña ${newPassword}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }

    
})
//DELETE
router.delete("/deleteUser/:email", function(request, response){
    response.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${request.params.email}`)
})




 router.get("/login", formularioLogin /*middleware*/ )
 router.get("/createAccount", formularioRegister)
 router.get("/confirmAccount/:token", confirm)
 router.get("/passwordRecovery", formularioPasswordRecovery)
 router.post("/passwordRecovery", passwordReset)

//Actualizar contraseña
router.get("/passwordRecovery/:token", verifyTokenPasswordChange) 
router.post("/passwordRecovery/:token", updatePassword)
export default router;