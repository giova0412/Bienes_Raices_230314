import { check, validationResult } from "express-validator";
import User from "../Models/Users.js";
import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Inicia Sesión',
    });
};

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    });
};

const register = async (req, res) => {
    // Validaciones de campos
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('Debes ingresar un correo válido').run(req);
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    await check('fechaNacimiento')
        .notEmpty().withMessage('La fecha de nacimiento no puede ir vacía')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('La fecha de nacimiento no es válida')
        .run(req);

    const result = validationResult(req);

    // Verificar si hay errores de validación
    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                fechaNacimiento: req.body.fechaNacimiento,
            },
        });
    }

    // Extraer datos
    const { nombre, email, password, fechaNacimiento } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya existe' }],
            user: {
                nombre,
                email,
                fechaNacimiento,
            },
        });
    }

    // Crear usuario en la base de datos
    const user = await User.create({
        nombre,
        email,
        password,
        fechaNacimiento,
        token: generateId(),
    });

    // Enviar email de confirmación
    registerEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token,
    });

    // Mostrar mensaje de confirmación
    res.render('templates/mesage', {
        page: 'Cuenta Creada Correctamente',
        mesage: 'Hemos enviado un correo de confirmación, presiona el enlace',
    });
};

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    // Verificar si el token es válido
    const confirmUser = await User.findOne({ where: { token } });

    if (!confirmUser) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu Cuenta',
            mesage: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true,
        });
    }

    // Confirmar la cuenta
    confirmUser.token = null;
    confirmUser.confirmAccount = true;
    await confirmUser.save();

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        mesage: 'La cuenta se confirmó correctamente',
    });
};

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: 'Recupera tu contraseña',
        csrfToken: req.csrfToken(),
    });
};

export {
    formularioLogin,
    formularioRegister,
    register,
    confirmAccount,
    formularioPasswordRecovery,
};
