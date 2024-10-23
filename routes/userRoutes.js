import express from 'express';

const router = express.Router();

router.get("/findByID/:id", (request, response) => {
    response.send(`Se está solicitando el usuario con ID ${request.params.id}`);
});

router.post("/newUser/:name/:email/:password", (req, res) => {
    res.send(`Se ha solicitado la creación de un nuevo usuario: ${req.params.name}, asociado al correo electrónico ${req.params.email} con la contraseña ${req.params.password}`);
});
//PUT - Se utiliza para la actualización total de información del cliente al servidor
router.put("/replaceUserByEmail/:name/:email/:password", function(a,b){
    b.send(`Se ha solicitado el reemplazo de toda la información del usuario: ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`)
  })
  //PATCH - Se utiliza para la actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request, response){
  
    const {email, newPass, passConfirm} = request.params;  // Desestructuración de un objeto
    
    if(newPass === passConfirm) {
      response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, se aceptan los cambios ya que la contraseña y confirmación son la misma.`);
    } else {
      response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña ${newPass}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`);
    }
  
  });
   //delette
   router.delete("/deleteUser/:email",function(req,res){
    res.send(`se ha solicitado la eliminacion del usuario acociado al correo ${req.params.email}`)
   })


export default router;



