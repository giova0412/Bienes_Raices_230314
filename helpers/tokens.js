import jwt from 'jsonwebtoken'

const generateJWT = id => jwt.sign(
    {
        id, // ID del usuario
        developerName: 'Giovanny',
        empresa: 'Universidad Tecnológica de Xicotepec de Juárez',
        tecnologias: 'Node.js'
    },
    process.env.JWT_SECRET, // Clave secreta desde el entorno
    {
        expiresIn: '1h' // Token válido por 1 hora
    }
)



const generatetId = () => Math.random().toString(32).substring(2) + Date.now().toString(32) 

export{
    generatetId,
    generateJWT
}