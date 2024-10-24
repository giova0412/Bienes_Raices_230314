import express from 'express';
import { formularioLogin, formularioRegister, formularioPasswordRecovery } from '../controllers/userControllers.js'; // Asegúrate de incluir .js

const router = express.Router();

router.get("/findByID/:id", (request, response) => {
    response.send(`Se está solicitando el usuario con ID ${request.params.id}`);
});

router.post("/newUser/:name/:email/:password", (req, res) => {
    res.send(`Se ha solicitado la creación de un nuevo usuario: ${req.params.name}, asociado al correo electrónico ${req.params.email} con la contraseña ${req.params.password}`);
});

// PUT - Actualización total de información
router.put("/replaceUserByEmail/:name/:email/:password", function(a, b) {
    b.send(`Se ha solicitado el reemplazo de toda la información del usuario: ${a.params.name}, con correo: ${a.params.email} y contraseña: ${a.params.password}`);
});

// PATCH - Actualización parcial
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request, response) {
    const { email, newPassword, newPasswordConfirm } = request.params;

    if (newPassword === newPasswordConfirm) {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, se aceptan los cambios ya que la contraseña y confirmación son la misma.`);
    } else {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña ${newPassword}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`);
    }
});

// DELETE - Eliminar usuario por correo
router.delete("/deleteUser/:email", function(req, res) {
    res.send(`Se ha solicitado la eliminación del usuario asociado al correo ${req.params.email}`);
});

// Rutas para formularios
router.get("/login", formularioLogin);
router.get("/register", formularioRegister);
router.get("/passwordRecovery", formularioPasswordRecovery);

export default router;






