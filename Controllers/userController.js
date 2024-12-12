import {check, validationResult} from 'express-validator'
import { generatetId, generateJWT } from '../helpers/tokens.js'
import { emailAfterRegister, emailChangePassword } from '../helpers/emails.js' 
import User from '../models/User.js'
import bcrypt from 'bcrypt'

const formularioLogin = (req, res) =>   {
        res.render("auth/login", {
            page : "Iniciar sesion",
            csrfToken: req.csrfToken()
        })
    }
 
    const userAuthentication = async (req, res) => {
        const { email, password } = req.body;
    
        // Validación básica
        await check('email').isEmail().withMessage('El correo no es válido').run(req);
        await check('password').notEmpty().withMessage('La contraseña no puede estar vacía').run(req);
    
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: result.array(),
                user: req.body
            });
        }
    
        const user = await User.findOne({ where: { email: email } });
    
        if (!user) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'Correo no registrado. Crea una cuenta para iniciar sesion' }],
                user: req.body
            });
        }
    
        if (!user.confirm) {
            return res.render('auth/login', {
                page: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'La cuenta aun no ha sido autenticada.' }],
                user: req.body
            });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'Contraseña incorrecta.' }],
                usuario: req.body
            });
        }
    
        // Generar el JWT
        const token = generateJWT(user.id);
    
        // Almacenar el token en una cookie
        res.cookie('_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo si es producción, asegurar que sea seguro
            sameSite: 'Strict',
        }).redirect('/myProperties');    
    };   

const formularioRegister = (request, response) =>  {
        response.render('auth/register', {
            page : "Crea una nueva cuenta", 
            csrfToken: request.csrfToken()
        })};

const formularioPasswordRecovery = (request, response) =>  {
    response.render('auth/passwordRecovery', {
            page : "Recuperación de Contraseña",
            csrfToken: request.csrfToken()
     })};

     const createNewUser = async (request, response) => {
        console.log('Datos recibidos:', request.body); // Depuración
        try {
            await check('nombre').notEmpty().withMessage("El nombre del usuario es un campo obligatorio.").run(request);
            await check('email').isEmail().withMessage("Debe ser un correo válido.").run(request);
            await check('password').isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres.").run(request);
            await check('confirmPassword').equals(request.body.password).withMessage("Las contraseñas deben coincidir.").run(request);
    
            const result = validationResult(request);
            if (!result.isEmpty()) {
                console.log('errors de validación:', result.array());
                return response.render('auth/register', {
                    page: 'Error al intentar crear la Cuenta de Usuario',
                    errors: result.array(),
                    csrfToken: request.csrfToken(),
                    user: { nombre: request.body.nombre, email: request.body.email }
                });
            }
    
            const { nombre, email, password, fechaNacimiento } = request.body;
    
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return response.render('auth/register', {
                    page: 'Error al intentar crear la Cuenta de Usuario',
                    errors: [{ msg: `El correo ${email} ya está registrado.` }],
                    csrfToken: request.csrfToken(),
                    user: { nombre }
                });
            }
    
            const newUser = await User.create({
                nombre, // Corrige el nombre del campo
                email,
                password,
                fechaNacimiento,
                token: generatetId()
            });
    
            emailAfterRegister({
                name: newUser.nombre,
                email: newUser.email,
                token: newUser.token
            });
    
            return response.render('templates/message', {
                page: 'Cuenta creada satisfactoriamente',
                msg: `Hemos enviado un correo a ${email} para confirmar tu cuenta.`,
                csrfToken: request.csrfToken()
            });
        } catch (error) {
            console.error("Error creando usuario:", error);
            return response.status(500).render('auth/register', {
                page: 'Error interno del servidor',
                errors: [{ msg: 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.' }],
                csrfToken: request.csrfToken()
            });
        }

    };    

    const confirm = async(request, response) => 
        {
            const {token } = request.params
            //validarToken - Si existe
            console.log(`Intentando confirmar la cuenta con el token: ${token}`)
            const userWithToken = await User.findOne({where: {token}});

            if(!userWithToken){
                response.render('auth/accountConfirmed', {
                    page: 'Error al confirmar tu cuenta.',
                    msg: 'El token no existe o ya ha sido utilizado, si ya has confirmado tu cuenta y aún no puedes ingresar, recupera tu contraseña aqui.',
                    error: true
                })
            }
            else
            {
                userWithToken.token=null
                userWithToken.confirm=1;
                await userWithToken.save();

                response.render('auth/accountConfirmed', {
                    page: 'Excelente..!',
                    msg: 'Tu cuenta ha sido confirmada de manera exitosa.',
                    error: false
                })

            }

        }
    
        const passwordReset = async (request, response) => {
            await check('email')
                .notEmpty().withMessage("El correo electrónico es obligatorio.")
                .isEmail().withMessage("Debe ser un correo válido.")
                .run(request);
        
            const result = validationResult(request);
        
            // Verificamos si hay errors de validación
            if (!result.isEmpty()) {
                console.log("errors de validación:", result.array());
                return response.render("auth/passwordRecovery", {
                    page: 'Error al intentar resetear la contraseña',
                    errors: result.array(),
                    csrfToken: request.csrfToken(),
                });
            }
        
            const { email } = request.body; // Corrección aquí
        
            try {
                // Validar si el usuario existe y está confirmado
                const existingUser = await User.findOne({ where: { email, confirm: 1 } });
        
                if (!existingUser) {
                    return response.render("auth/passwordRecovery", {
                        page: 'Error',
                        csrfToken: request.csrfToken(),
                        errors: [{ msg: `No existe una cuenta verificada asociada a este correo.` }],
                    });
                }
        
                console.log("El usuario existe en la BD");
        
                // Generar un nuevo token
                existingUser.token = generatetId();
                await existingUser.save();
        
                // Enviar el correo de cambio de contraseña
                emailChangePassword({
                    name: existingUser.nombre, // Suponiendo que el campo es `nombre`
                    email: existingUser.email,
                    token: existingUser.token,
                });
        
                response.render('templates/message', {
                    csrfToken: request.csrfToken(),
                    page: 'Solicitud aceptada',
                    msg: `Hemos enviado un correo a ${email} para actualizar tu contraseña.`,
                });
            } catch (error) {
                console.error("Error en passwordReset:", error);
                response.status(500).render("auth/passwordRecovery", {
                    page: 'Error interno',
                    csrfToken: request.csrfToken(),
                    errors: [{ msg: 'Ocurrió un error inesperado. Inténtalo más tarde.' }],
                });
            }
        };
        

        const verifyTokenPasswordChange =async(request, response)=>{
    
            const {token} = request.params;
            const userTokenOwner = await User.findOne({where :{token}})
    
            if(!userTokenOwner)
                { 
                    response.render('templates/message', {
                        csrfToken: request.csrfToken(),
                        page: 'Error',
                        msg: 'El token ha expirado o no existe.'
                    })
                }
        
             
           
            response.render('auth/reset-password', {
                csrfToken: request.csrfToken(),
                page: 'Restablece tu password',
                msg: 'Por favor ingresa tu nueva contraseña'
            })
        }
    
        const updatePassword = async(request, response)=>{
    
            const {token}= request.params
    
            //Validar campos de contraseñas
            await check('new_password').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:6}).withMessage("La constraseña debe ser de almenos 6 carácteres.").run(request)
            await check("confirm_new_password").equals(request.body.new_password).withMessage("La contraseña y su confirmación deben coincidir").run(request)
    
            let result = validationResult(request)
    
            if(!result.isEmpty())
                {
                    return response.render("auth/reset-password", {
                        page: 'Error al intentar crear la Cuenta de Usuario',
                        errors: result.array(),
                        csrfToken: request.csrfToken(),
                        token: token
                    })
                }
    
            //Actualizar en BD el pass 
            const userTokenOwner = await User.findOne({where: {token}}) 
            userTokenOwner.password=request.body.new_password
            userTokenOwner.token=null;
            userTokenOwner.save();  // update tb_users set password=new_pasword where token=token;
    
            //Renderizar la respuesta
            response.render('auth/accountConfirmed', {
                page: 'Excelente..!',
                msg: 'Tu contraseña ha sido confirmada de manera exitosa.',
                error: false
            })
    
        }
    

export {formularioLogin, userAuthentication, formularioRegister, formularioPasswordRecovery, createNewUser, confirm, passwordReset, verifyTokenPasswordChange, updatePassword}