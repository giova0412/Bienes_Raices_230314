import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hola desde la web de Node.js");
});

router.get("/quienEres", (req, res) => {
    res.json({
        "nombre": "Raúl",
        "carrera": "DSM",
        "grado": "4",
        "grupo": "A"
    });
});

export default router;


  