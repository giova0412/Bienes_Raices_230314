const formularioLogin = (request, response) => {
    response.render('auth/login', { autenticado: false });
};

const formularioRegister = (request, response) => {
    response.render('auth/register', { autenticado: false });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', { autenticado: false }); // Asegúrate de que la vista exista
};

export { formularioLogin, formularioRegister, formularioPasswordRecovery };
